define(function(require){

    var templatePath = js_base_url + "ng/app/adv-search/templates/";


    // ----- requireJS dependencies ------ //
    var angular = require('angular'),
        ngRoute = require('ngRoute'),
        ngAnimate = require('ngAnimate'),
        colorpicker = require('ngColorPicker'),
        // load services
        dlServices = require('services/searchString'),
        dlServices = require('services/esSearch'),
        dlServices = require('services/collectionData'),
        dlServices = require('services/apifields'),
        dlServices = require('services/fieldService'),

        dlAnimations = require('animations'),
        dlFilters = require('filters'),
        dlFacets = require('facets');


    var advSearchApp = angular.module('advSearchApp',[
            'ngRoute',
            'ngAnimate',
            'dlServices',
            'dlAnimations',
            'dlFilters',
            'dlFacets',
            'colorpicker.module'
            // 'angularModalService'   
        ]
        // ['$routeProvider', function($routeProvider){
        //     reloadOnSearch(false);
        // }]
    );


    advSearchApp.boot = function(){
        angular.bootstrap(document, ['advSearchApp']);
    };


    advSearchApp.config(["$interpolateProvider", "$routeProvider", "$locationProvider", function($interpolateProvider, $routeProvider, $locationProvider){
            $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
            $locationProvider.html5Mode({
                enabled:true,
                requireBase: true
            });

            // $routeProvider.reloadOnSearch(false);
        }]
    );


    /************** ADVANCED SEARCH CONTROLLERS *****************/

    advSearchApp.controller('advSearchController', ['esSearchString', 'esSearchService', '$scope', '$rootScope', '$location', '$http', 'facetService', 'collectionData', '$q', 'apifields', 'fieldService', 'utility',
        function(searchString, es, $scope, $rootScope, $location, $http, facetService, collectionData, $q, apifields, fieldService, utility) {

            fieldService.getFields().then(function(){
                init(); // Go!
            });

            // set up initial scope vars and functions
            function init(){
                $scope.rssSortStore = 7;
                $rootScope.facetsLoaded = false;
                // set facets to display as columns
                facetService.columns = true;
                // facetService.orderField = 'key';   // ordering by key does not yield good UI without further work               
                $rootScope.facetsLoaded = false;
                facetService.columns = true; // set facets to display as columns
                facetService.minimized = true; // set default facet state to closed
                facetService.defaultSort = 'key'; // set default facet sort to alphabetical

                $scope.loadFacets = function(){
                    // console.log($rootScope.facetsLoaded, $scope.hideFacets);

                    if ($rootScope.facetsLoaded) return;
                    for (var f in facetService.facets) {
                        facetService.facets[f].open = false;
                    }
                    // sort aggregates by term descending
                    // searchString.vars.aggSort = {'_term' : 'asc'};
                    if ($rootScope.facetsLoaded) return;
                    // start facet query
                    facetService.newFacetQuery('*');
                    $scope.facetsLoaded = true;
                };

                // adv search form input ('search segment builder')

                // get searchable fields from apifields service

                // var fields = ['all fields'];
                // fields = fields.concat(apifields.fields);

                var fields = {};
                fieldService.getFields(fieldService.advSearchFields).then(function(response){
                    fields = response;
                    fields.allfields = {
                        label: 'All fields',
                        map: 'all fields'
                    };
                    fields.titleCombined = {
                        label: "All title fields",
                        map: "title combined"
                    };
                    $scope.querySegments = [
                        {
                            track: querySegmentTracker,
                            keywords: '',
                            fields: {
                                opts: fields,
                                selected: 'all fields'
                            }, anyAll: {
                                opts: [ 'any of these words:', 'all of these words:', 'this exact phrase:'],
                                selected: 'all of these words:'
                            }, bool: {
                                opts: [ 'AND', 'OR', 'NOT'],
                                selected: 'AND'
                            }
                        }
                    ];
                });

                var querySegmentTracker = 0;

                $scope.addSegment = function() {
                    querySegmentTracker++;
                    utility.gaEvent('advanced_search', 'add_segment', querySegmentTracker + '_segments');
                    $scope.querySegments.push(
                        {
                        track: querySegmentTracker,
                        keywords: '',
                        fields: {
                            opts: fields,
                            selected: 'all fields'
                        }, anyAll: {
                            opts: [ 'any of these words:', 'all of these words:', 'this exact phrase:'],
                            selected: 'all of these words:'
                        }, bool: {
                            opts: [ 'AND', 'OR', 'NOT'],
                            selected: 'AND'
                        }
                    });
                };


                $scope.rmSegment = function(track) {
                    $scope.querySegments.splice(track,1);
                };

                // catch select events
                $scope.selectEvent = function(action, label){
                    utility.gaEvent('advanced_search', action, label);
                };

                // triggered by facet selections
                // sets vars to pass selections to results page
                var filters = {};

                facetService.changed(function(){
                    filters.all = '';

                    angular.forEach(searchString.vars.filter, function(v, key) {

                        filters[key] = '';
                        // console.log(typeof searchString.vars.filter.begin === 'object');
                        if (key === 'sortDate' && typeof searchString.vars.filter.sortDate.begin === 'object'){
                            // console.log(searchString.vars.filter.sortDate);
                            filters.sortDate = '&dBegin=' + searchString.vars.filter.sortDate.begin.key + '&dEnd=' + searchString.vars.filter.sortDate.end.key;
                            // console.log('DATE', filters)
                        }
                        // all others
                        else if (searchString.vars.filter[key].terms.length === 0){
                            filters[key] =  '&' + key + '=none';
                        } else {
                            angular.forEach(searchString.vars.filter[key].terms, function(v, i){
                                // console.log(key, filters[key]);
                                filters[key] += '&' + key + '=' + encodeURIComponent(v);
                            });
                        }
                        filters.all = filters.all.concat(filters[key]);     
                    });

                    $scope.embed.filterString = JSON.stringify(filters.all);
                });

                $scope.search = function(){
                    var query = "?q=" + encodeURIComponent(makeQueryString()),
                        limits = filters.all || '',
                        url = '/search';
                    var fullquery = url + query + limits;
                    if ($scope.circleOnly){
                        fullquery += '&circle=y';
                    }
                    utility.gaEvent('advanced_search', 'execute_search');
                    // console.log(fullquery)
                    window.location.href = fullquery;
                };

                // closed state for facets by default
                $scope.hideFacets = true;

                // UPDATE SECTIONS ON SEGMENT CHANGES
                // note: deep watch (with 'true' paremeter) can be resource-intensive
                $scope.$watch('querySegments', function(){
                    // console.log('segment change!');
                    // update display string
                    $scope.displayString = makeQueryString();

                    $scope.updateApiData();
                    //$scope.updateRSSData();
                    $scope.updateWidgetData();

                    var rssSort = $('#rssSort').length == 0 ? 7 : $('#rssSort').val(),
                        query = "?q=" + makeQueryString() + "&sort=" + rssSort,
                        limits = filters.all || '';
                    $scope.rss.queryString = query + limits;

                }, true);

                // update on facet changes
                facetService.changed(function(){
                    $scope.updateApiData();
                    //$scope.updateRSSData();
                    $scope.updateWidgetData();

                    var rssSort = $('#rssSort').length == 0 ? 7 : $('#rssSort').val(),
                        query = "?q=" + makeQueryString() + "&sort=" + rssSort,
                        limits = filters.all || '';
                    $scope.rss.queryString = query + limits;
                });

                $scope.changeRSSSort = function() {
                    var rssSort = $('#rssSort').length == 0 ? 7 : $('#rssSort').val(),
                        query = "?q=" + makeQueryString() + "&sort=" + rssSort,
                        limits = filters.all || '';
                    $scope.rss.queryString = query + limits;
                };

                // loadApi obj false to start
                $scope.apiLoaded = false;
                $scope.loadApi = function(){
                    if(!$scope.apiLoaded){ $scope.apiLoaded = true; }
                    $scope.updateApiData();
                    //$scope.updateRSSData();
                };

                // set API URL
                $scope.apiUrl = "https://oc-index.library.ubc.ca/search?api_key=";


                // load Search Widget
                $scope.widgetLoaded = false;
                $scope.loadWidget = function(){
                    if(!$scope.widgetLoaded){ $scope.widgetLoaded = true; }
                    $scope.updateWidgetData();
                };

                // Embeddable Search Widget Default Data
                $scope.embed = {
                    src: js_base_url + 'embed/search.js',
                    placeholder: "Search the Open Collections",
                    color: '#002145',
                    inline : false,
                    keepQuery: false,
                    queryString: '*'
                };

                $scope.rss = {
                    queryString: '*'
                };

                // set api fields & template from apifields service
                apifields.getFields().then(function(response){
                    $scope.apiFields = response;
                });
                
                $scope.apiFieldsTemplate = apifields.selectTemplate;
                //$scope.updateApiData();
                //$scope.updateRSSData();

            }

             // make query string from segments (for ACTUAL SEARCH)

            function makeQueryString(opts) {
                var qString = '';
                angular.forEach($scope.querySegments, function(v, key){
                    var bool = '',
                        keywords = '',
                        fields = '',
                        escapes = ['+', '-', '&&', '||', '!', '(', ')', '{', '}', '[', ']', '^', '"', '~', '*', '?', ':'],
                        re;
                    // keywords = v.keywords || '*';

                    if (v.keywords === '') { keywords = '*'; } else { keywords = v.keywords; }
                    
                    if (key !== 0) {
                        bool = ' ' + v.bool.selected + ' ';
                    }
                    if (v.fields.selected != 'all fields') {
                        fields = v.fields.selected + ': ';
                    }

                    if (v.anyAll.selected === 'this exact phrase:'){

                        // escape lucene special characters - backslash seperate to prevent crazy loops.
                        if(keywords !== '*'){
                            v.keywords = v.keywords.replace('\\', '\\\\');
                            for (var i = 0, len = escapes.length; i < len; i++){
                                // keywords = keywords.replace(re, '\\' + escapes[i], 'g');  global flag doesn't work in Chrome.
                                keywords = keywords.split(escapes[i]).join('\\' + escapes[i]);
                            }
                        }
                        keywords = '"'+ keywords + '"';
                        // console.log(keywords);
                    }
                    else if (v.anyAll.selected === 'all of these words:') {
                        // get rid of silly quotes.. 
                        keywords = keywords.replace(/"/g,'');
                        keywords = keywords.split(' ').join(' AND ');
                        if(v.fields.selected != 'all fields'){
                            keywords = '('+ keywords + ')';
                        }
                    }
                    else if (v.anyAll.selected === 'any of these words:' && v.fields.selected != 'all fields') {
                        keywords = '('+ keywords + ')';
                    }

                    
                    if(v.fields.selected === 'title combined'){
                        qString += bool + '(title:' + keywords + ' OR alternateTitle:' + keywords + ')';  // hack to support combined title searching
                    } else {
                        qString += bool + fields + keywords;
                    }
                });


                function getKeywords(keywords, fields) {

                }

                return qString;
            }


            function getSearchString(fields){
                var body;

                if (fields){
                    // if api, use that method
                    return searchString.makeString({
                        query : $scope.displayString,
                        aggsObj: 'omit',
                        scriptFields: 'omit',
                        fields: fields
                    }).then(function(response){
                        // console.log(response);
                        return $q.when(response);
                    });
                } else {
                    // otherwise normal search string method for search widget
                    return searchString.makeString({
                        query : $scope.displayString,
                        scriptFields : 'omit',
                        aggsObj : 'omit',
                    }).then(function(response){
                        // console.log(response);
                        return  $q.when(response);
                    });
                }

            }

            function getQueryObj(body){
                var nicks = elasticsearch_main;

                var obj =  {
                    from : 0,
                    size : 10,
                    body : body,
                    index: nicks,
                    type : 'object'
                };
                
                if (searchString.vars.filter.collection.terms.length > 0) {
                    nicks = searchString.vars.filter.collection.terms;
                    // resolve aggregate collection nicks to full strings with collectionData service, then set index 
                    return collectionData.resolveAggs(nicks).then(function(response){
                        obj.index = response;
                        return $q.when(obj);
                    });   
                } else {
                    // if no collections selected, just return query obj
                    return $q.when(obj);
                }
                
            }

            $scope.updateApiData = function()   {
                if(!$scope.apiLoaded) return;
                 console.log(apifields.getSelected());
                    getSearchString(apifields.getSelected()).then(function(response){
                        // console.log(response);
                        getQueryObj(response).then(function(response2){
                            $scope.apiObj = JSON.stringify(response2, null, 2);

                    }); 
                });
            };

            $scope.updateRSSData = function() {
                var query = "?q=" + makeQueryString(),
                    limits = filters.all || '';

                getSearchString(apifields.getSelected()).then(function(response){
                    getQueryObj(response).then(function(response2){
                        $scope.rss.queryString = encodeURIComponent(JSON.stringify(response2, null, 2));

                    });
                });
            };

            $scope.updateWidgetData = function()  {
                if(!$scope.widgetLoaded) return;
                
                if($scope.embed.keepQuery){
                    $scope.embed.queryString = JSON.stringify($scope.displayString);
                }

                if($scope.embed.inline) {
                    getSearchString(["creator","ubc.date.sort","title","ubc.internal.handle","ubc.internal.provenance.nick","ubc.internal.repo","ubc.internal.repo.handle"]).then(function(response){
                        getQueryObj(response).then(function(response2){
                            $scope.embed.queryObj = response2;
                        });
                    });
                } else {
                    $scope.embed.queryObj = {};
                }
                

            };



    }])// END advSearchController


    /************** ADVANCED SEARCH DIRECTIVES *****************/



    .directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.ngEnter);
                    });
     
                    event.preventDefault();
                }
            });
        };
    })

    .directive('advsSection', ["utility", function(utility){
        return{
            restrict: 'A',
            scope: true,
            link: function($scope, element, attrs){
                element.find('.dl-collapse-title').on('click', function(){
                    utility.gaEvent('item_page', 'accordion_section', attrs.advsSection + "_" + String($scope.isOpen));
                });
            }
        };
    }])
    .directive('colorbox', function(){
        return{
            restrict: 'A',
            scope: {
                color: '='
            },         
            link: function($scope, element, attrs){

                var thisColor = rgb2hex(element.css('background-color'));

                element.on('click', function(){
                    $scope.color = thisColor;
                    $scope.$apply();
                    // console.log(thisColor, $scope.color);
                    element.siblings('.dl-colorbox').removeClass('selected');
                    element.addClass('selected');
                });

                $scope.$watch('color', function(){
                    element.removeClass('selected');
                });

                function rgb2hex(rgb){
                 rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
                 return (rgb && rgb.length === 4) ? "#" +
                  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
                  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
                  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
                }
               
            }
        };
    }); 

    // END advSearchApp.--

    return advSearchApp;
});