// FACETS MODULE

// TICKETS:  DL-477, DL-334, DL-475, DL-476

define(function(require) {
    // path to templates for directives

    var templatePath = js_base_url + "ng/app/shared/facets/templates/";

    // Define Module (in this case, a standalone "App" for )
    // var results = angular.module('dlApp.results', ['elasticsearch']);
    require('moreless');
    var angular = require('angular'),
        services = require('services/services'),
        dlD3charts = require('d3datechart'),
        dlFilters = require('filters'),
        dlAnimations = require('animations'),
        dlServices = require('services/collectionData'),
        dlServices = require('services/fieldService'),
        ngTranslate = require('pascalprecht.translate');

    var facets = angular.module('dlFacets', ['dlServices', 'dlFilters', 'dlD3charts', 'dlAnimations','pascalprecht.translate']
    ).config(['$translateProvider', function ($translateProvider) {

        $translateProvider.translations('en', {
            'AFFILIATION': 'Affiliation',
            'CAMPUS': 'Campus',
            'CLEAR': 'Clear',
            'COLLECTION': 'Collection',
            'CREATOR(S)': 'Creator(s)',
            'DATE RANGE': 'Date range',
            'DEGREE': 'Degree',
            'DRILL_DOWN': 'Drill-down',
            'DRILL_DOWN_DESC': 'Filter terms will be updated each time a filter is added, narrowing to reflect the new results each time.',
            'FACET': 'Facet',
            'FACET_DESC': 'All filter terms for the current search query will remain visible regardless filters added. Many filters can be added, but conflicting selections may yield no results.',
            'FILTERS_HIDE': 'Hide filters',
            'FILTERS_SHOW': 'Show filters',
            'GENRE': 'Genre',
            'KEYWORDS': 'Keywords',
            'LOAD_MORE': 'Load More',
            'OPTIONS': 'Options',
            'PROGRAM': 'Program',
            'SCHOLARLY LEVEL': 'Scholarly level',
            'SUBJECT': 'Subject',
            'TYPE': 'Type',
        });
             
        $translateProvider.translations('fr', {
            'AFFILIATION': 'Affiliation',
            'CAMPUS': 'Campus',
            'CLEAR': 'Supprimer',
            'COLLECTION': 'Collection',
            'CREATOR(S)': 'Créateur(s)',
            'DATE RANGE': 'Intervalle de dates',
            'DEGREE': 'Degré',
            'DRILL_DOWN': 'Percer',
            'DRILL_DOWN_DESC': 'Filtrer les termes seront mis à jour chaque fois qu\'un filtre est ajouté, se rétrécissant pour refléter les nouveaux résultats à chaque fois.',
            'FACET': 'Facette',
            'FACET_DESC': 'Tous les termes de filtre pour la requête de recherche en cours resteront visibles, indépendamment des filtres ajoutés. De nombreux filtres peuvent être ajoutés, mais les sélections contradictoires peuvent donner aucun résultat.',
            'FILTERS_HIDE': 'Masquer les filtres',
            'FILTERS_SHOW': 'Afficher les filtres',
            'GENRE': 'Genre',
            'KEYWORDS': 'Mots clés',
            'LOAD_MORE': 'Montre plus',
            'OPTIONS': 'Options',
            'PROGRAM': 'Programme',
            'SCHOLARLY LEVEL': 'Niveau scolaire',
            'SUBJECT': 'Sujet',
            'TYPE': 'Type',
        });
        $translateProvider.useSanitizeValueStrategy('escape');            
    }]);

    /************** FACETS CONTROLLERS *****************/
    // NOTE: results and advanced search modules use their own top level controllers for facets,
    // controllers and directives for shared functionality are here.

    // NOTE on DATE FILTER:  Date filter works with (and DEPENDS ON) the 'datechart' in d3charts.js.
    // input is parsed into date objects and visualized by d3, and passed back as millisecond keys for ES filtering.

    // facet group
    facets
        .controller('facetsController', ['$scope', '$rootScope', 'esSearchString', '$filter', '$q', 'facetService', 'fieldService', '$http', '$templateCache', 'utility',
            function($scope, $rootScope, searchString, $filter, $q, facetService, fieldService, $http, $templateCache, utility) {

                // load and cache templates up front
                $http.get(templatePath + 'date-input.html?version='+app_version, { cache:$templateCache });
                $http.get(templatePath + 'facet-group.html?version='+app_version, { cache:$templateCache });
                $http.get(templatePath + 'facet-opts.html?version='+app_version, { cache:$templateCache });
                $http.get(templatePath + 'facets.html?version='+app_version, { cache:$templateCache });

                // keep filters?
                $scope.keepFilters = searchString.keepFilters;
                $scope.keepFiltersToggle = function(){
                    $scope.keepFilters = !$scope.keepFilters;
                    utility.gaEvent('facet_opts', 'keep_filters', $scope.keepFilters);
                    searchString.keepFilters = $scope.keepFilters;
                };
                // facet behavior style
                $scope.fBehavior = facetService.fBehavior;
                $scope.behaviorChange = function(val){
                    utility.gaEvent('facet_opts', 'filter_behavior', val);
                    facetService.fBehavior = val;
                    facetService.change();
                };

                facetService.makeFacetsObj().then(function(response){
                    $scope.f = $filter('orderObjectBy')(response, 'order');
                    // SPLIT-COLUMN "CHUNKED" FACETS VIEW (Theses / Advanced Search Pages)
                    $scope.chunked = false;
                    if(facetService.columns){
                        $scope.chunked = true;
                        var chunkSize = Math.ceil($scope.f.length / 2);
                        $scope.f = chunk($scope.f, chunkSize, 0);
                        // console.log($scope.f);
                    }
                    function chunk(arr, size, start){
                        var newArr = [];
                        for (var i=start; i<arr.length; i+=size) {
                            newArr.push(arr.slice(i, i+size));
                        }
                        return newArr;
                    }
                });

            }])

        .controller('fGroupController', ['$scope', '$rootScope', 'esSearchString', 'esSearchService', '$timeout', 'collectionData', 'facetService', 'datechart', 'utility','$translate',
            function($scope, $rootScope, searchString, es, $timeout, collectionData, facetService, datechart, utility, $translate) {

                // NEW FACET QUERY

                var aggArr = new Array($scope.ff.label);
                var searchOpts = {};  // container to cache search opts for refreshing this facet independently.

                // default sort reverse values for each field (and track current state)
                $scope.trackReverse = {
                    'key' : false,
                    'title' : false,
                    'doc_count' : true
                };
                $scope.orderField = facetService.facets[$scope.ff.label].sortField;

                // new facet query triggers update
                facetService.onNewFacetQuery(function(e, query, index, callback){
                    $rootScope.facetsLoaded = false;
                    var opts = {
                        query : query,
                        aggArr : aggArr
                    };
                    if(index){ opts.index = index; }
                    searchOpts = opts;  // save opts to use on refresh/re-sort
                    getFacetsData(opts).then(function(response){
                        $rootScope.facetsLoaded = true;
                    });
                });

                // GET FACET DATA
                // facets elasticSearch call : searchString and esSearch promises are consolidated here:
                // takes options as input and returns response.aggs as a promise

                var fIndex = false;
                var getFacetsData;
                getFacetsData = function (opts) {
                    $scope.optsLoading = true;
                    if (opts.index) {
                        fIndex = opts.index;
                    } else {
                        fIndex = false;
                    }

                    // default search string object
                    var searchStringObj = {
                        aggsArr: opts.aggArr,
                        aggSize: 20,
                        scriptFields: 'omit',
                        fields: 'omit'
                    };
                    //if query is included, add it:
                    if (opts.query) {
                        searchStringObj.query = opts.query;
                    }
                    if (opts.aggArr[0] === 'collection') {
                        searchStringObj.aggSize += 100;  /// make this one bigger to offset aggregate collection weirdness.
                    }
                    // set sort
                    searchStringObj.aggSort = makeAggSort($scope.orderField);
                    // check for overrides in opts object:
                    for (var attr in searchStringObj) {
                        if (opts && opts.hasOwnProperty(attr)) {
                            searchStringObj[attr] = opts[attr];
                        }
                    }
                    // if expanded behavior, don't include filters object, switch execution behavior
                    if (facetService.fBehavior === "expand") {
                        searchStringObj.filter = 'omit';
                        searchStringObj.filterExecution = 'or';
                    }
                    // get search string (promise 1), THEN do search (promise 2)
                    return searchString.makeString(searchStringObj).then(function (response) {

                        var searchInput = {
                            body: response,
                            from: 0,
                            size: 0,
                            search_type: 'count'
                        };

                        if (facetService.fBehavior === "expand") {
                            searchInput.searchIndex = fIndex || 'oc';
                            if (searchString.dspOnly === 'y') {
                                searchInput.searchIndex = fIndex || 'dsp';
                            }
                        }

                        window.setTimeout(0); // ensure animations get attached correctly.
                        es.search(searchInput).then(function (response) {
                            setFacetOpts(response.aggs);
                            $scope.optsLoading = false;
                            updateFilters();
                            return response;
                        });
                    });
                };

                // console.log('fGroupController', $scope.ff);
                // updateFilters();
                facetService.updateFilters(updateFilters);
                function updateFilters(){

                    console.trace('UPDATE FACET ', $scope.ff.label, 'translating: ', $scope.ff.translateKey.toUpperCase() );
                    // Re-translate the facet label
                    $translate( $scope.ff.translateKey.toUpperCase() ).then(function(t) { $scope.ff.display = t; })

                    // console.log('searchstring filters', $scope.ff, searchString.vars.filter[$scope.ff.label]);
                    // handle dates

                    if($scope.ff.label === 'sortDate'){

                        // use timeout to ensure node exists for D3 to draw into.
                        if ((searchString.vars.filter.sortDate.begin && searchString.vars.filter.sortDate.end) || facetService.facets.sortDate.buckets.length > 1) {
                            $scope.hide = false;
                            $timeout(function(){
                                datechart.drawDateChart(facetService.facets.sortDate.buckets);
                            },0);

                            $scope.ff.selection.begin = searchString.vars.filter.sortDate.begin;
                            $scope.ff.selection.end = searchString.vars.filter.sortDate.end;

                            // console.log('update date filters:', searchString.vars.filter.sortDate.begin, searchString.vars.filter.sortDate.end);

                            if (searchString.vars.filter.sortDate.begin && searchString.vars.filter.sortDate.begin != 'undefined'){
                                $scope.selected = searchString.vars.filter.sortDate.begin.display + ' to ' + searchString.vars.filter.sortDate.end.display;
                            } else {
                                $scope.selected ='';
                            }
                        } else {
                            $scope.hide = true;
                        }


                        // console.log('selection', $scope.ff.selection);
                    } else {
                        $scope.activeFilters = searchString.vars.filter[$scope.ff.label].terms || [];

                        if ($scope.ff.buckets.length < 1 && $scope.activeFilters.length < 1) {
                            $scope.hide = true;
                            return;
                        } else {
                            $scope.hide = false;
                        }
                        // add legible titles to array for collections

                        // NOTE: collections don't use normal filters:
                        // collections are filtered by changing es.input.searchIndex value

                        if($scope.ff.label === 'collection'){
                            $scope.activeFilterTitles = [];
                            for (var i = 0; i < searchString.vars.filter.collection.terms.length; i++) {
                                var term = searchString.vars.filter.collection.terms[i];
                                collectionData.getTitle(term).then(function(response){
                                    $scope.activeFilterTitles.push(response.title);
                                });
                            }
                            $scope.orderField = $scope.orderField === 'key' ? 'title' : $scope.orderField;
                        }
                    }
                    moreCheck();
                }

                // re-order facets

                $scope.sortBy = function(field){
                    utility.gaEvent('facets', 'order_by_' + field, $scope.ff.label);
                    if (!$scope.moreBtn) {
                        reorderUi();
                    } else {
                        $scope.optsLoading = true;
                        reorderUi();
                        getFacetsData(searchOpts).then(function(){
                        });
                    }
                    function reorderUi(){
                        if ($scope.orderField === field) {
                            $scope.trackReverse[field] = !$scope.trackReverse[field];
                        }
                        $scope.orderField = field;
                    }
                };

                function makeAggSort(field){
                    var aggSort = {},
                        dir = ($scope.trackReverse[field]) ? 'desc' : 'asc',
                        sortOn = (field === 'key' || field === 'title') ? '_term' : '_count';

                    // console.log($scope.trackReverse[field], dir);

                    aggSort[sortOn] = dir;
                    return aggSort;
                }

                $scope.addFilter = function(term, title){
                    utility.gaEvent('facets', 'add_filter', $scope.ff.label);
                    if($scope.activeFilters.indexOf(term) === -1) {
                        $scope.activeFilters.push(term);
                        if(title){
                            $scope.activeFilterTitles.push(title);
                        }
                        searchString.vars.filter[$scope.ff.label].terms = $scope.activeFilters;
                        facetService.change();
                    }
                    // console.log('addFilter:', $scope.activeFilters);
                };

                $scope.removeFilter = function(term, title){
                    utility.gaEvent('facets', 'remove_filter', $scope.ff.label);
                    var index = $scope.activeFilters.indexOf(term);
                    if(index > -1) {
                        $scope.activeFilters.splice(index, 1);
                        if($scope.activeFilterTitles){
                            $scope.activeFilterTitles.splice(index, 1);
                        }
                        searchString.vars.filter[$scope.ff.label].terms = $scope.activeFilters;
                        facetService.change();
                    }

                    // console.log('removeFilter:', term, title, index, $scope.activeFilters);
                };

                $scope.isFiltered = function(check){
                    if($scope.activeFilters.indexOf(check) === -1) {
                        return false;
                    } else {
                        return true;
                    }
                };

                $scope.clearFilterGroup = function(all){

                    $scope.activeFilters = [];
                    $scope.activeFilterTitles = [];
                    searchString.vars.filter[$scope.ff.label].terms = $scope.activeFilters;
                    // clear date filters
                    if ($scope.ff.label === 'sortDate'){
                        searchString.vars.filter.sortDate.begin = '';
                        searchString.vars.filter.sortDate.end = '';
                        $scope.selected = '';
                        datechart.drawDateChart(facetService.facets.sortDate.buckets);
                    }
                    if(all !== 'all'){
                        utility.gaEvent('facets', 'clear_filter_group', $scope.ff.label);
                        return facetService.change();
                    }
                };

                // $scope.$on('clearAllFilters', function(){
                //  $scope.clearFilterGroup('all');
                // });
                facetService.clearFilters(function(){
                    $scope.clearFilterGroup('all');
                });

                // open/close facet group

                $scope.isOpen = facetService.facets[$scope.ff.label].open;
                $scope.toggle = function(){
                    if ($scope.isOpen === true){
                        facetService.facets[$scope.ff.label].open = false;
                    } else {
                        facetService.facets[$scope.ff.label].open = true;
                    }
                    $scope.isOpen = facetService.facets[$scope.ff.label].open;
                    utility.gaEvent('facets', 'toggle: ' + $scope.isOpen, $scope.ff.label);
                };

                // LOAD MORE FACET OPTIONS
                $scope.optsCount = facetService.optsCount;

                $scope.loadMore = function() {
                    utility.gaEvent('facets', 'load_more', $scope.ff.label);
                    $scope.optsLoading = true;
                    $scope.optsCount += 60;
                    searchOpts.aggSize = $scope.optsCount;
                    console.log($scope.orderField);
                    getFacetsData(searchOpts).then(function(response){
                    });

                };

                function moreCheck(){
                    // if more facets to load, show load more button
                    if (facetService.facets[$scope.ff.label].sum_left > 0) {
                        $scope.moreBtn = true;
                    } else {
                        $scope.moreBtn = false;
                    }
                }

                // DATE FACET
                // **NOTE: this filter works closely and depends on the 'datechart' d3 directive
                $scope.dateRangeFilter = function(begin, end) {
                    // console.log('RANGEFILTER dates', begin, end);

                    if(!begin || !end) {
                        return;
                    }
                    searchString.vars.filter.sortDate.begin = begin;
                    searchString.vars.filter.sortDate.end = end;
                    var term = begin.display + ' to ' + end.display;
                    $scope.selected = term;
                    utility.gaEvent('facets', 'apply_date_filter', $scope.ff.label);
                    facetService.change();
                };
            }])




        /************** FACETS DIRECTIVES *****************/
        .directive('facets', [ function() {
            return {
                restrict: 'EA',
                scope: {
                    f:'=',
                    chunked: '='
                },
                templateUrl: templatePath + 'facets.html?version='+app_version,
            };
        }])

        .directive('facetGroup', [ function() {
            return {
                restrict: 'EA',
                scope: true,
                controller: 'fGroupController',
                templateUrl: templatePath + 'facet-group.html?version='+app_version,
            };
        }])

        //facets clear button
        .directive('facetOpts', function() {
            return {
                restrict: 'EA',
                scope: '=',
                templateUrl: templatePath + 'facet-opts.html?version='+app_version
            };
        })

        // NOTE: date input works closely with and depends on the 'datechart' directive in d3charts.js
        .directive('dateInput', function() {
            return {
                restrict: 'EA',
                scope: '=',
                templateUrl: templatePath + 'date-input.html?version='+app_version,
                link: link
            };
            function link(scope, element, attrs){
                // ANYTIME.JS jQuery Datepicker (requires anytime.js!!)
                // set options
                var options = {
                    format: '%z %B',
                    askEra: true,
                    askSecond: false,
                    set: new Date(($(this).value))
                };
            }
        });



    /************** FACETS SERVICE *****************/
    // holds facet objects' data and opts, handles change notifications

    services.factory('facetService',
        [ 'esSearchService', 'esSearchString', 'utility', '$rootScope', 'fieldService', 'collectionData', '$filter','$translate',
            function (es, searchString, utility, $rootScope, fieldService, collectionData, $filter, $translate) {

                var facetService = {};

                facetService.columns = false;

                // replace this with an array to only display certain facets.
                facetService.showOnly = false;
                // number of options to show by default
                facetService.optsCount = 20;
                // which field to order on
                // facetService.defaultSort = {
                //     field : 'doc_count',  // should be 'key' or 'doc_count'
                //     reverse : false
                // };
                facetService.defaultSort = 'doc_count';  // should be 'key' or 'doc_count'
                facetService.minimized = false; // if true, all facets load 'closed' by default

                // initiate new facet query
                facetService.newFacetQuery = function(query, index, callback){
                    $rootScope.$emit('facetquery', query, index, callback);
                };
                facetService.onNewFacetQuery = function(callback){
                    $rootScope.$on('facetquery', callback);
                };
                // watcher to act on changes to facets
                // use facetService.change(function(){action});
                facetService.changed = function(callback){
                    $rootScope.$on('facetChange', callback);
                };
                // notify application of changes to facets (emit has way better performance than broadcast)
                // use facetService.change();
                facetService.change = function(){
                    $rootScope.$emit('facetChange');
                };

                // force facets to update
                facetService.updateFilters = function(callback){
                    $rootScope.$on('updateFiltersNow', callback);
                };
                // notify application of changes to facets (emit has way better performance than broadcast)
                // use facetService.change();
                facetService.updateFiltersNow = function(){
                    $rootScope.$emit('updateFiltersNow');
                };

                // force facets to update
                facetService.clearFilters = function(callback){
                    $rootScope.$on('clearFiltersNow', callback);
                };
                // notify application of changes to facets (emit has way better performance than broadcast)
                // use facetService.change();
                facetService.clearFiltersNow = function(){
                    $rootScope.$emit('clearFiltersNow');
                };

                facetService.makeFacetsObj = function(){
                    return fieldService.getFields().then(function(){
                        // if 'show only' array exists, use that, otherwise use all fields defined in fieldservice.facetFields
                        var fArray = (facetService.showOnly) ? facetService.showOnly : fieldService.facetFields;
                        var obj = {};

                        for (var i = 0; i < fArray.length; i++){
                            if(fArray[i] === 'sortDate'){
                                obj.sortDate = {
                                    order: -5,
                                    label: 'sortDate',
                                    display: 'date range',
                                    translateKey: 'date range',
                                    buckets: {},
                                    selection: {
                                        begin: {},
                                        end: {}
                                    },
                                    selected: '',
                                    open   : true
                                };
                            } else {
                                var orderVal = i;
                                if(fArray[i] === 'collection'){
                                    orderVal = -6;
                                } else if(fArray[i] === 'type'){
                                    orderVal = -4;
                                } else if(fArray[i] === 'genre'){
                                    orderVal = -3;
                                } else if(fArray[i] === 'creator'){
                                    orderVal = -2;
                                } else if(fArray[i] === 'subject'){
                                    orderVal = -1;
                                }
                                obj[fArray[i]] = {
                                    order : orderVal,
                                    label: fArray[i],
                                    display: fieldService.fields[fArray[i]].label,
                                    translateKey: fieldService.fields[fArray[i]].label,
                                    buckets : {},
                                    open: false,
                                    sum_left: 0,
                                    sortField: facetService.defaultSort
                                };
                                $translate( obj[fArray[i]].translateKey.toUpperCase() ).then(function(t) { obj[fArray[i]].display = t; })
                            }

                            if (facetService.minimized) { obj[fArray[i]].open = false; }

                        }
                        facetService.facets = obj;
                        return obj;
                    });
                };


                // set facet options
                setFacetOpts = function(aggInput){
                    // set facets based on aggs output
                    for (var f in aggInput) {
                        facetService.facets[f].sum_left = aggInput[f].sum_other_doc_count;
                        if (f === 'collection'){
                            // handle collections
                            collectionData.aggsSubsCols().then(function(d){
                                facetService.facets.collection.buckets = makeColsData(aggInput.collection.buckets, d.data);
                                // console.log('FACETcollections', facetService.facets.collection.buckets);
                            });
                        } else {
                            facetService.facets[f].buckets = aggInput[f].buckets;
                        }
                    }

                    // order type buckets
                    if (facetService.facets.type){
                        facetService.facets.type.buckets = $filter('orderObjectBy')(facetService.facets.type.buckets, 'doc_count', 'reverse');
                    }

                    // check nicks from ES against collection data from DB and build collection data for facets
                    function makeColsData(colAggs, titles){
                        var collectionsData = [];

                        // console.log(colAggs, titles);

                        angular.forEach(colAggs, function(d,i){

                            // check if nick is a sub collection
                            for(var sub in titles.sub_cols){

                                if (sub === d.key) {

                                    var s = titles.sub_cols[sub];

                                    // if sub is visible, add it to collectionsData
                                    if (s.viz === 1) {

                                        // console.log('visible sub collection', s)

                                        var subObj = {
                                            title: s.title,
                                            key: d.key,
                                            doc_count: d.doc_count
                                        };
                                        collectionsData.push(subObj);
                                    }

                                    // add parent aggregate to collectionsData if not already added
                                    var parent = s.parent;
                                    // console.log(parent);
                                    var aggObj = {
                                        title: titles.aggregates[parent].title,
                                        key: titles.aggregates[parent].nick,
                                        // csv: titles.aggregates[parent].csv,
                                        doc_count: d.doc_count
                                    };

                                    if (checkAgg(aggObj.key) === 'add'){
                                        collectionsData.push(aggObj);
                                        return;
                                    } else {
                                        collectionsData[checkAgg(aggObj.key)].doc_count += aggObj.doc_count;
                                        return;
                                    }
                                }
                            }

                            for (var col in titles.cols){
                                if (col === d.key){
                                    var colObj = {
                                        title: titles.cols[col].title,
                                        key: d.key,
                                        // csv: d.key,
                                        doc_count: d.doc_count
                                    };
                                    collectionsData.push(colObj);
                                    return;
                                }
                            }

                        });

                        return collectionsData;

                        function checkAgg(key){
                            for(var i = 0; i < collectionsData.length; i++){
                                if (collectionsData[i] && key === collectionsData[i].key){
                                    return i;
                                }
                            }
                            return 'add';
                        }
                    }
                };

                // drill down facet behavior by default
                facetService.fBehavior = 'drill';
                return facetService;
            }]);

    return facets;

});