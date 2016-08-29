// Search Results Module

// TICKETS: DL-495, DL-476, DL-477, DL-475, DL-125, DL-467,

define(function (require) {

    var templatePath = js_base_url + "ng/app/results/templates/";

    // ----- requireJS dependencies ------ //
    require('jquery', 'moreless');
    var angular = require('angular'),
        ngRoute = require('ngRoute'),
        ngAnimate = require('ngAnimate'),
        dlFacets = require('facets'),
        dlPagination = require('pagination'),
        dlSavedItems = require('savedItems'),
        dlAnimations = require('animations'),
        dlFilters = require('filters'),
        dlThumbs = require('thumbnails'),
        dlD3charts = require('d3onebar'),
        i8 = require('services/i8'),

        dlServices = require('services/fieldService');
    dlServices = require('services/searchString');
    dlServices = require('services/esSearch');
    dlServices = require('services/collectionData');
    dlServices = require('services/responsive');
    dlServices = require('services/highlighter');


    // path to templates for directives

    var resultsApp = angular.module('resultsApp', [
            'ngRoute',
            'ngAnimate',
            // 'ngSanitize',
            'dlServices',
            'dlAnimations',
            'dlFilters',
            'dlFacets',
            'dlD3charts',
            'dlSavedItems',
            'dlPagination',
            'dlThumbs'
        ],
        ['$locationProvider', function ($locationProvider) {
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
        }],
        ['$routeProvider', function ($routeProvider) {
            reloadOnSearch(false);
        }]
    ).config(["$interpolateProvider", function ($interpolateProvider) {
            $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
        }]
    );

    resultsApp.boot = function () {
        angular.bootstrap(document, ['resultsApp']);
    };

    // UPDATE TEMPLATE CACHE (tCache service in services.js)
    resultsApp.run(['tCache', function (tCache) {
        tCache.clearCache();  // clear cache on dev
        tCache.templatePath = templatePath;
        tCache.getTemplates(['results-parent.html', 'results-list2.html', 'inner-results.html']);
    }]);


    // SEARCH CONTROLLER
    // search functionality and routing
    //*******************************************************//
    resultsApp.controller('searchController',
        ['esSearchString',
            'esSearchService',
            '$scope',
            '$rootScope',
            '$location',
            'rExport',
            '$timeout',
            '$filter',
            'pageService',
            'collectionData',
            'max400',
            'highlighter',
            'facetService',
            'fieldService',
            'utility',
            function (searchString, es, $scope, $rootScope, $location, rExport, $timeout, $filter, pVars, collectionData, max400, highlighter, facetService, fieldService, utility) {
                $scope.rUpdating = true;
                // make sure fields mappings are loaded FIRST
                fieldService.getFields().then(function () {
                    // Go!
                    init();
                }, function (error) {
                    $scope.searchError = 'error';
                });

                var lucky = false;

                // Setup scoped stuff

                function init() {
                    // pre-load collections data (makes page load much faster)
                    collectionData.aggsSubsCols();

                    // SET INITIAL VARS
                    $scope.total = undefined;
                    $scope.noTerms = false;
                    $scope.placeholder = 'Search for something!';
                    $scope.esr = {};
                    $scope.filterCount = searchString.filterCount;
                    $scope.pageRange = [0];
                    //view options
                    $scope.rViewOptions = [{
                            "index": 0,
                            "label": "List view",
                            "perPage": 20
                        }, {
                            "index": 1,
                            "label": "Detailed view",
                            "perPage": 20
                        }, {
                            "index": 2,
                            "label": "Thumbnail view",
                            "perPage": 60
                        }];
                    //sort options
                    $scope.rSortOptions = [{
                        "index": 0,
                        "label": "Sort by relevance",
                        "field": false,
                        "order": "desc",
                    }, {
                        "index": 1,
                        "label": "sort by title A-Z",
                        "field": "title",
                        "order" : "asc",
                    }, {
                        "index": 2,
                        "label": "Sort by title Z-A",
                        "field": "title",
                        "order": "desc",
                    }, {
                        "index": 3,
                        "label": "Sort by author A-Z",
                        "field": "creator",
                        "order": "asc",
                    }, {
                        "index": 4,
                        "label": "Sort by author Z-A",
                        "field": "creator",
                        "order": "desc",
                    }, {
                        "index": 5,
                        "label": "Sort oldest to newest",
                        "field": "sortDate",
                        "order": "asc",
                    }, {
                        "index": 6,
                        "label": "Sort newest to oldest",
                        "field": "sortDate",
                        "order": "desc",
                    }];

                    // UPDATE SEARCH BASED ON INITIAL VARS TO START APP
                    //*******************************************************//
                    // all new searches are triggered by changing url location

                    // INITIALIZE
                    getLocation(updateSearch);
                    // UPDATE ON LOCATION CHANGE
                    $scope.$on('$locationChangeSuccess', function () {
                        getLocation(updateSearch);
                    });

                    // INITIALIZE SCOPE FUNCTIONS
                    //*******************************************************//
                    //SEARCH FUNCTIONS
                    $scope.newSearch = function newSearch() {
                        $scope.q = $scope.terms;
                        // console.log('NEW SEARCH', 'keep filters:', searchString.keepFilters);
                        // reset page number
                        $scope.currentPage = 0;
                        $scope.hidePages = true;
                        // keep filters?
                        if (searchString.keepFilters === false) {
                            facetService.clearFiltersNow();
                            updateLocation();
                        } else {
                            updateLocation();
                        }
                    };

                    $scope.updateSearch = function updateSearch(category) {
                        // catch GA interactions
                        if (category) {
                            if (category === 'sort') {
                                utility.gaEvent('search_results', 'sort_change', $scope.rSort.label);
                            } else if (category === 'view') {
                                utility.gaEvent('search_results', 'view_change', $scope.resultsView.label);
                            }
                        }
                        // update URL string
                        updateLocation();
                    };

                    $scope.modifySearch = function modifySearch() {
                        // console.log('MODIFY SEARCH');
                        $scope.currentPage = 0;
                        updateLocation();
                    };

                    // modify search on facet
                    facetService.changed($scope.modifySearch);

                    // update facets & searchString on switch between cIRcle / all content
                    $scope.dspChange = function () {
                        utility.gaEvent('search_results', 'circle_only_radio', $scope.dspOnly);
                        searchString.dspOnly = $scope.dspOnly;
                        facetService.clearFiltersNow();
                        $scope.modifySearch();
                    };

                    // update search on pagination change
                    // uses jQuery .. make sure it's loaded
                    pVars.changed(function () {
                        $scope.currentPage = pVars.currentPage;
                        updateLocation();
                        try {
                            if ($(window).scrollTop() > 800) {
                                console.log('to top of page')
                                $(window).scrollTop(0);
                            }
                        } catch (e) {
                            console.error(e, 'probably no jquery');
                        }
                    });

                    // Filter Actions
                    $scope.clearAllFilters = function () {
                        facetService.clearFiltersNow();
                        $scope.modifySearch();
                    };
                    $scope.addFilter = function (f, t) {
                        utility.gaEvent('search_results', 'add_filter', f);
                        var term = $filter('stripHtmlTags')(t);
                        var index = searchString.vars.filter[f].terms.indexOf(term);
                        // console.log('toggle filter', f, term, index);
                        if (index === -1) {
                            searchString.vars.filter[f].terms.push(term);
                        }
                        $scope.modifySearch();
                        // if $apply did not already get called, do it (needed for passUp from d3 directives)
                        if (!$scope.$$phase) $scope.$apply();
                    };

                    // pass data from child directives (d3 clicks)
                    $scope.passUp = function (obj) {
                        if (obj.act !== 'filter') {
                            return;
                        }
                        $scope.addFilter(obj.key, obj.term);

                    };

                    // responsive listener for small screens
                    // this is used in the results list to prevent thumbnails from loading when they aren't visible.
                    max400.watch();
                    max400.ismatch(function () {
                        $scope.max400 = true;
                        // console.log('MAX 400 TRUE');
                    });
                    max400.notmatch(function () {
                        $scope.max400 = false;
                        // console.log('MAX 400 FALSE');
                    });
                }  //-- end init();

                // APP FUNCTIONS
                //*******************************************************//
                // track number of search updates to make sure facets fire on pageload
                var searchCounter = 0;
                // var fireFacets = true;
                // Search elasticSearch / send new search parameters to search services
                function updateSearch(callback) {
                    //update filter count
                    searchString.updateCount();
                    $scope.filterCount = searchString.filterCount;
                    // should facets fire?
                    if (searchCounter === 0 || $scope.q !== searchString.vars.query) {
                        $rootScope.facetsLoaded = false;
                    } else {
                        $rootScope.facetsLoaded = true;
                    }
                    $scope.searchError = false;
                    $scope.rUpdating = true;

                    //update search string
                    searchString.vars.query = $scope.q;
                    searchString.vars.sort = {field: $scope.rSort.field, order: $scope.rSort.order};
                    searchString.dspOnly = $scope.dspOnly;

                    //update search box
                    $scope.terms = $scope.terms || $scope.q;

                    // update page vars
                    pVars.perPage = $scope.resultsView.perPage;
                    pVars.update();

                    //update highlighting terms
                    highlighter.getTerms();

                    if (website_env !== 'prod') {
                        console.log("searchString", searchString);
                    }

                    //define search input, THEN do search
                    // remove string option when stringify can be removed.
                    searchString.makeString().then(function (response) {
                        var searchInput = {
                            from: pVars.from || 0,
                            size: pVars.perPage,
                            body: response
                        };
                        es.search(searchInput).then(function (response) {
                            searchCounter++;
                            $scope.rUpdating = false;
                            // fire facet queries
                            facetService.newFacetQuery($scope.q);
                            // typedata for onebar viz
                            $scope.typeData = response.aggs.type;
                            // update results
                            $scope.esr = {
                                results: response.results
                            };
                            $scope.total = response.total;
                            $scope.hidePages = false;
                            // Do you feel lucky, punk?  -- if only 1 result, &lucky=1, go directly to item.
                            if (lucky && lucky === true && $scope.total === 1) {
                                if (website_env !== 'prod') {
                                    console.log('DIRECT HIT!');
                                }
                                $scope.lucky = true;
                            }
                            if (!$scope.terms) {
                                $scope.terms = $scope.q || $scope.placeholder;
                            }
                            // update pagination vars
                            if (pVars.total != $scope.total) {
                                pVars.total = $scope.total;
                            }
                        }, function (error) {
                            $scope.rUpdating = false;
                            $scope.searchError = error;
                            $scope.total = 0;
                            $scope.esr = {};
                        });
                    });

                    typeof callback == 'function' && callback();

                }

                // update URL
                function updateLocation(callback) {
                    utility.windowstop();
                    // get dates from obj
                    var beginKey = '', endKey = '';
                    // console.log(searchString.vars.filter.sortDate);
                    if (searchString.vars.filter.sortDate.begin && searchString.vars.filter.sortDate.end) {
                        beginKey = searchString.vars.filter.sortDate.begin.key;
                        endKey = searchString.vars.filter.sortDate.end.key;
                    }

                    var locObj = {
                        'q': encodeURIComponent($scope.q),
                        'p': $scope.currentPage,
                        'sort': $scope.rSort.index,
                        'view': $scope.resultsView.index,
                        'circle': $scope.dspOnly,

                        'dBegin': beginKey,
                        'dEnd': endKey,

                        // add searchcounter to trigger new searches on same query string
                        'c': searchCounter
                    };

                    // add filters
                    for (var f in searchString.vars.filter) {
                        if (f !== 'sortDate' && searchString.vars.filter[f].terms) {
                            locObj[f] = searchString.vars.filter[f].terms;
                        }
                    }
                    $location.search(locObj);
                    // log as pageview in GA
                    // note: this starts as of Apr 2016, previous analytics will be skewed light on searches
                    utility.gaPageview($location.url());
                    typeof callback == 'function' && callback();
                }

                // get URL string data
                function getLocation(callback) {
                    if (website_env !== 'prod') {
                        console.log("getLocation");
                    }
                    var locSearch = $location.search();
                    // get current page
                    $scope.currentPage = Number(locSearch.p) || 0;
                    pVars.currentPage = Number(locSearch.p) || 0;
                    // get view
                    $scope.resultsView = $scope.rViewOptions[Number(locSearch.view) || 0];
                    $scope.rSort = $scope.rSortOptions[Number(locSearch.sort) || 0];
                    // get search type
                    $scope.dspOnly = locSearch.circle || "n";
                    // make scope.q natural string so that ES doesn't get thrown off by plusses
                    // $scope.q = searchString.makeNaturalStr(locSearch.q) || '*';
                    $scope.q = decodeURIComponent(locSearch.q) || '*';
                    //get query
                    $scope.terms = $scope.q;
                    // Setup RSS LINK
                    $scope.rssLink = website_base_url + "/rss/search/rss.xml?q=" + encodeURIComponent($scope.q) + "&sort=" + $scope.rSort.index + "&circle=" + $scope.dspOnly;
                    // get filters
                    angular.forEach(searchString.vars.filter, function (v, key) {
                        // var decodedKey = decodeURIComponent(key);
                        searchString.vars.filter[key].terms = getLocFilters(key);
                        if (searchString.vars.filter[key].terms.length > 0) {
                            $scope.rssLink = $scope.rssLink + "&" + key + "=" + encodeURIComponent(searchString.vars.filter[key].terms.join('~@~'));
                        }
                    });
                    // do you feel lucky? (punk)  .. jump to first result
                    if (locSearch.lucky && locSearch.lucky == 1) {
                        lucky = true;
                    }
                    // is this initiated by a search widget? log it.
                    if (locSearch.widgetquery) {
                        utility.gaEvent('search_results', 'widget_query', locSearch.widgetquery);
                    }
                    // get date begin/end
                    if (locSearch.dBegin && locSearch.dEnd) {
                        // console.log('add date filters!', locSearch.dBegin, locSearch.dEnd);
                        searchString.vars.filter.sortDate.begin = {
                            key: locSearch.dBegin,
                            display: $filter('date')(locSearch.dBegin, 'yyyy')
                        };
                        searchString.vars.filter.sortDate.end = {
                            key: locSearch.dEnd,
                            display: $filter('date')(locSearch.dEnd, 'yyyy')
                        };
                        $scope.rssLink = $scope.rssLink + '&dBegin=' + locSearch.dBegin + '&dEnd=' + locSearch.dEnd;
                    }
                    function getLocFilters(loc) {
                        var output = [];
                        var input = locSearch[loc];
                        if (input === undefined || input === 'none' || input.length < 1) {
                            // console.log('locfilters no iput');
                            return [];
                        } else {
                            if (input instanceof Array) {
                                for (var i = 0; i < input.length; i++) {
                                    output.push(decodeURIComponent(input[i]));
                                }
                            } else {
                                output.push(decodeURIComponent(input));
                            }
                            // console.log('locfilters ouput!', output);
                            return output;
                        }
                    }

                    typeof callback == 'function' && callback();
                }
            }
        ])

    // RESULTS CONTROLLER
    // child scope & view for each search result
    //*******************************************************//
        .controller('resultController', [
            '$scope',
            // 'esSearchService',
            // 'i8',
            'esSearchString',
            // '$sce',
            'rExport',
            'collectionData',
            '$http',
            '$filter',
            'highlighter',
            'fieldService',
            'utility',
            function ($scope,
                      // es,
                      searchString,
                      // $sce,
                      rExport,
                      collectionData,
                      $http,
                      $filter,
                      highlighter,
                      fieldService,
                      utility) {

                var query = searchString.vars.query;

                // will need to grab language from somewhere..
                var language = 'en';
                $scope.base_url = website_base_url;

                // check view
                // detailed view
                // console.log($scope.resultsView.index)
                if ($scope.resultsView.index === 1) {
                    $scope.detailView = true;
                    $scope.details = true;
                }

                // get field mappings from fieldservice (promise)
                fieldService.getFields(fieldService.resultsFields).then(function (response) {
                    setR(response);
                });

                function setR(rFields) {

                    var source = $scope.r._source;
                    // normal terms scope

                    var hasFields = function () {
                        var arr = [];
                        for (var prop in source) {
                            for (var p in rFields) {
                                if (rFields[p].map === prop) {
                                    arr.push(p);
                                }
                            }
                        }
                        return arr;
                    }();

                    // console.log('source', source, 'rFields', rFields, 'hasFields', hasFields);
                    // set required / special field vals
                    $scope.r = {
                        // app vars
                        _id: $scope.r._id,
                        repo: source[rFields.repo.map],
                        compound: $scope.r.fields.is_compound[0],
                        saved: rExport.isSaved($scope.r._id),
                        nick: utility.mustBeString($scope.r._source[rFields.nick.map]),
                        handle: source[rFields.handle.map],
                        // default view
                        title: highlighter.highlight(singleVal(source[rFields.title.map])),
                        sortDate: highlighter.highlight($filter('formatSortDate')(source[rFields.sortDate.map])),
                        creator: highlighter.highlight(source[rFields.creator.map]),
                        type: (source[rFields.type.map]) ? source[rFields.type.map][0] : undefined,
                        // special cases
                        embargoed: (source[rFields.repo.map] === 'dsp') ? (checkEmbargo(source[rFields.dateAvailable.map])) : false,
                        // details object (filled below)
                        detail: {}
                    };

                    // add detail view fields for any fields not already added above, only if details visible
                    var detailsParsed = false;

                    function parseDetails() {
                        $scope.r.description = highlighter.highlight(source[rFields.description.map]);
                        for (var i = 0; i < hasFields.length; i++) {
                            if (!$scope.r.hasOwnProperty(hasFields[i])) {
                                // console.log(hasFields[i]);
                                if (hasFields[i] !== 'dateAvailable') {
                                    $scope.r.detail[hasFields[i]] = {
                                        field: hasFields[i],
                                        label: rFields[hasFields[i]].label,
                                        val: highlighter.highlight(source[rFields[hasFields[i]].map]),
                                        facetField: facetable(hasFields[i])
                                    };
                                }
                            }
                        }
                        detailsParsed = true;
                    }

                    if ($scope.details) {
                        parseDetails();
                    }

                    // toggle detailed list view
                    $scope.toggleDetails = function () {
                        if ($scope.details) {
                            $scope.details = false;
                        } else {
                            if (!detailsParsed) {
                                parseDetails();
                            }
                            if (!$scope.innerContent) {
                                getInnerResults();
                            }
                            $scope.details = true;
                        }
                    };

                    //check if field is facetable
                    function facetable(check) {
                        return fieldService.facetFields.indexOf(check) !== -1 ? true : false;
                    }

                    // make sure single val exists for TITLE
                    function singleVal(check) {
                        if (check) {
                            return check;
                        } else {
                            return '[title unknown]';
                        }
                    }

                    // check if embargoed
                    function checkEmbargo(input) {
                        if (!input) return false;
                        var today = new Date(), eDate = new Date(input);
                        // console.log('input:', input, 'eDate:', eDate, 'today:', today);
                        return ((eDate >= today) ? true : false);
                    }

                    // get correct collection data and hyperlinks
                    collectionData.getTitle($scope.r.nick).then(function (response) {
                        // set collection name
                        $scope.r.collection = (response && response.title) ? highlighter.highlight(response.title) : '[' + $scope.r.nick + ']';
                        var nick = (response && response.nick) ? response.nick : $scope.r.nick;
                        // set item link
                        if ($scope.r.nick != nick) {
                            $scope.r.itemLink = 'collections/' + nick + '/' + $scope.r.nick + '/items/' + $scope.r._id;
                        }
                        else if ($scope.r.repo == 'dsp') {
                            $scope.r.itemLink = 'cIRcle/collections/' + nick + '/items/' + $scope.r._id;
                        }
                        else {
                            //if(nick == 'bcbib') { nick = 'bcbooks'}
                            $scope.r.itemLink = 'collections/' + nick + '/items/' + $scope.r._id;
                        }
                        // if 'lucky', go directly to item
                        if ($scope.lucky === true) {
                            window.location = '/' + $scope.r.itemLink;
                        }
                        // if compound object, add search query string to url for viewer
                        if ($scope.r.compound) {
                            $scope.r.itemLink = $scope.r.itemLink.concat('#p0z-10000r0f:' + encodeURIComponent(searchString.vars.query));
                            //console.log($scope.r.itemLink);
                        }
                        // set collection link
                        $scope.r.collectionLink = 'collections/' + nick;
                    });

                    // load page level results for compound objects (if showing details)
                    if ($scope.r.compound && $scope.details) {
                        getInnerResults();
                    }
                    function getInnerResults() {
                        // if empty query, then set compound to false because in-text searching is useless (hides the whole thing)
                        if (query === '*') {
                            $scope.r.compound = false;
                            return;
                        }

                        var dashedId = $scope.r._id.replace(/\./g, "-");
                        var newHandle = $scope.r.repo + "." + $scope.r.nick + "." + dashedId;
                        // otherwise do in text search:
                        // var iiifUrl = iiif_api +'/'+ $scope.r.repo + "." + $scope.r.nick + "." + dashedId + '&search=' + encodeURIComponent(query) + '&json';
                        var iiifUrl = iiif_api + '/viewer/excerpt.php?handle=' + newHandle + '&search=' + encodeURIComponent(query) + '&json';
                        $http.get(iiifUrl).then(function (response) {
                            if (website_env !== 'prod') {
                                console.log('inner response', response.data);
                            }

                            if (!response.data) {
                                $scope.innerContent = {
                                    error: true
                                }
                            } else if (response.data.error) {
                                $scope.innerContent = {
                                    error: true,
                                    pData: response.data
                                };
                            } else {
                                var pages = [];
                                for (var i in response.data) {
                                    var p = {page: parseInt(i) + 1, index: i};
                                    pages.push(p);
                                    response.data[i].pI = i;
                                }
                                $scope.innerContent = {
                                    error: false,
                                    query: query,
                                    handle: newHandle,
                                    pages: pages,
                                    pData: response.data
                                };

                            }
                            // console.log($scope.innerContent);
                        }, function (error) {
                            // console.log('inner data error', error);
                            $scope.innerContent = {
                                error: true
                            }
                        });

                    }
                }

                // SAVE RESULT TO FOLDER
                $scope.saveResult = function (r) {
                    $scope.r.saved = rExport.save(r);
                };
                $scope.$watch(function () {
                    return rExport.saved;
                }, function (val) {
                    $scope.r.saved = rExport.isSaved($scope.r._id);
                });
            }
        ]);


    /************** RESULTS DIRECTIVES *****************/
    // parent
    resultsApp.directive('resultsView', function () {
        return {
            restrict: 'EA',
            templateUrl: templatePath + 'results-parent.html?version=' + app_version,
            // link : link
        };
    })

    //views
        .directive('resultsList', function () {
            function link(scope, element, attrs) {
                var btn = element.find('.dl-r-more'),
                    hide = element.find('.dl-r-metadata-table');
                hide.simpleSlide(btn);
            }

            return {
                restrict: 'A',
                templateUrl: templatePath + 'results-list2.html?version=' + app_version,
                link: link
            };
        })
        .directive('sidebarShow', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    element.on('click', function () {
                        $('#cols-wrap').sidebar({'toggle': true});
                    });
                }
            };
        })

        // INNER RESULTS DIRECTIVES
        .directive('innerResults', ["utility", function (utility) {
            return {
                restrict: 'EA',
                templateUrl: templatePath + 'inner-results.html?version=' + app_version,
                scope: {data: '='},
                controller: ["$scope", function ($scope) {
                    if ($scope.data.error) {
                        $scope.innerError = true;
                    } else {
                        $scope.currentPi = $scope.data.pages[0].index;
                        $scope.pClick = function (pi) {
                            if ($scope.currentPi === pi) {
                                utility.gaEvent('search_results', 'inner_result', 'clickthrough');
                                var split = $scope.data.pData[pi].access.split(':');
                                document.location = split.join(':');
                            } else {
                                $scope.currentPi = pi;
                            }
                        };

                    }
                }]
            };
        }])
        // only show highlight divs after images have loaded
        .directive('hlonload', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    element.bind('load', function () {
                        $(this).css('background', 'none').nextAll('.highlight').css('visibility', 'visible');
                    });
                }
            };
        });

    return resultsApp;
});
