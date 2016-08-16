define(function (require) {

    var angular = require('angular');
    var services = require('services/services');
    var ngRoute = require('ngRoute');
    var dlServices = require('services/fieldService');


    // build ES Query Object
    services.factory('esSearchString', ['utility', '$location', 'fieldService', '$http', '$q', function (utility, $location, fieldService, $http, $q) {
        var searchString = {};

        //  SET DEFAULT PARAMETERS (can  be overridden with opts object in makeString())
        /********************************/

        // filter vars & options
        searchString.filterCount = 0;
        searchString.keepFilters = true;
        searchString.filters = {};
        // just search circle?
        searchString.dspOnly = "n";  // string values y/n are easier to deal with the radio btns

        //  query string string parameter vars
        searchString.vars = {};
        searchString.vars.query = '*';
        searchString.vars.random = false;
        searchString.vars.sort = {field: false, order: false};

        // stringify output
        searchString.vars.stringy = false;

        // default aggregate fields
        searchString.vars.aggsObj = {};
        searchString.vars.aggsArr = ['type'];
        searchString.vars.aggSize = 20;
        searchString.vars.aggSort = {'_count': 'desc'};

        // default fields
        searchString.vars.fields = fieldService.resultsFields;
        searchString.vars.scriptFields = {
            is_compound: {
                script_file: "not_empty_array"
            }
        };

        // make sure fields are loaded, then init filters obj
        fieldService.getFields().then(function () {
            searchString.vars.filter = initFiltersObj();
        });

        // INITIALIZE FILTERS OBJECT
        function initFiltersObj() {
            var obj = {}, fArray = fieldService.facetFields;
            for (var i = 0; i < fArray.length; i++) {
                if (fArray[i] === 'sortDate') { // date is special case
                    obj.sortDate = {
                        // field   : "ubc.date.sort",
                        terms: [],
                        begin: '',
                        end: ''
                    };
                } else { // all others take mapped field and append '.raw'
                    obj[fArray[i]] = {
                        field: fieldService.fields[fArray[i]].map + '.raw',
                        terms: []
                    };
                }
            }
            return obj;
        };

        // COUNT ACTIVE FILTERS
        searchString.updateCount = function () {
            searchString.filterCount = 0;
            for (var i in searchString.vars.filter) {
                searchString.filterCount += searchString.vars.filter[i].terms.length;
            }
            if (searchString.vars.filter.sortDate.begin && searchString.vars.filter.sortDate.end) {
                searchString.filterCount += 1;
            }
            return searchString.filterCount;
        };


        // SET DEFAULT QUERY OBJECT
        // Default query object loaded from external source or use this fallback
        var defaultQueryObj = {};
        function getDefaultQueryObj(query) {
            if (angular.equals(defaultQueryObj, {})) {
                // set the correct endpoint for prod / dev
                var queryStringSource = (website_env != 'prod') ? 'https://oc-index.library.ubc.ca/_queryString/query-latest' : 'https://oc-index.library.ubc.ca/_queryString';
                return $http.get(queryStringSource)
                    .then(
                        function (response) {
                            defaultQueryObj = response.data;
                            if (website_env != "prod") {
                                console.log('queryObj loaded', defaultQueryObj);
                            }
                            return defaultQueryObj;
                        },
                        function (error) {
                            console.log('error loading external search string, defaulting to fallback.');
                            // fallback query
                            return {
                                "filtered": {
                                    "query": {
                                        "bool": {
                                            "should": [{
                                                "match": {
                                                    "collection": {
                                                        "query": "REPLACE_ME",
                                                        "minimum_should_match": "2<-30% 7<-3",
                                                        "lenient": true
                                                    }
                                                }
                                            }, {
                                                "match": {
                                                    "creator": {
                                                        "query": "REPLACE_ME",
                                                        "minimum_should_match": "2<-30% 7<-3",
                                                        "lenient": true
                                                    }
                                                }
                                            }, {
                                                "match": {
                                                    "date": {
                                                        "query": "REPLACE_ME",
                                                        "lenient": true
                                                    }
                                                }
                                            }, {
                                                "match": {
                                                    "genre": {
                                                        "query": "REPLACE_ME",
                                                        "minimum_should_match": "2<-30% 7<-3",
                                                        "lenient": true
                                                    }
                                                }
                                            }, {
                                                "match": {
                                                    "geographicLocation": {
                                                        "query": "REPLACE_ME",
                                                        "minimum_should_match": "2<-30% 7<-3",
                                                        "lenient": true
                                                    }
                                                }
                                            }, {
                                                "match": {
                                                    "language": {
                                                        "query": "REPLACE_ME",
                                                        "minimum_should_match": "2<-30% 7<-3",
                                                        "lenient": true
                                                    }
                                                }
                                            }, {
                                                "match": {
                                                    "subject": {
                                                        "query": "REPLACE_ME",
                                                        "minimum_should_match": "2<-30% 7<-3",
                                                        "lenient": true,
                                                        "boost": 1.5
                                                    }
                                                }
                                            }, {
                                                "match": {
                                                    "type": {
                                                        "query": "REPLACE_ME",
                                                        "minimum_should_match": "2<-30% 7<-3",
                                                        "lenient": true
                                                    }
                                                }
                                            }, {
                                                "match": {
                                                    "category": {
                                                        "query": "REPLACE_ME",
                                                        "minimum_should_match": "2<-30% 7<-3",
                                                        "lenient": true
                                                    }
                                                }
                                            }, {
                                                "match": {
                                                    "peerReviewStatus": {
                                                        "query": "REPLACE_ME",
                                                        "minimum_should_match": "2<-30% 7<-3",
                                                        "lenient": true
                                                    }
                                                }
                                            }, {
                                                "match": {
                                                    "personOrCorporation": {
                                                        "query": "REPLACE_ME",
                                                        "minimum_should_match": "2<-30% 7<-3",
                                                        "lenient": true
                                                    }
                                                }
                                            }, {
                                                "match": {
                                                    "scholarlyLevel": {
                                                        "query": "REPLACE_ME",
                                                        "minimum_should_match": "2<-30% 7<-3",
                                                        "lenient": true
                                                    }
                                                }
                                            }, {
                                                "match": {
                                                    "series": {
                                                        "query": "REPLACE_ME",
                                                        "minimum_should_match": "2<-30% 7<-3",
                                                        "lenient": true
                                                    }
                                                }
                                            }, {
                                                "match": {
                                                    "campus": {
                                                        "query": "REPLACE_ME",
                                                        "minimum_should_match": "2<-30% 7<-3",
                                                        "lenient": true
                                                    }
                                                }
                                            }, {
                                                "match": {
                                                    "program": {
                                                        "query": "REPLACE_ME",
                                                        "minimum_should_match": "2<-30% 7<-3",
                                                        "lenient": true
                                                    }
                                                }
                                            }, {
                                                "match": {
                                                    "affiliation": {
                                                        "query": "REPLACE_ME",
                                                        "minimum_should_match": "2<-30% 7<-3",
                                                        "lenient": true
                                                    }
                                                }
                                            }, {
                                                "match": {
                                                    "degree": {
                                                        "query": "REPLACE_ME",
                                                        "minimum_should_match": "2<-30% 7<-3",
                                                        "lenient": true
                                                    }
                                                }
                                            }, {
                                                "match": {
                                                    "description": {
                                                        "query": "REPLACE_ME",
                                                        "minimum_should_match": "2<-30% 7<-3",
                                                        "lenient": true,
                                                        "boost": 2
                                                    }
                                                }
                                            }, {
                                                "match": {
                                                    "contents": {
                                                        "query": "REPLACE_ME",
                                                        "minimum_should_match": "2<-30% 7<-3",
                                                        "lenient": true,
                                                        "boost": 2
                                                    }
                                                }
                                            }, {
                                                "match": {
                                                    "title": {
                                                        "query": "REPLACE_ME",
                                                        "minimum_should_match": "2<-30% 7<-3",
                                                        "lenient": true,
                                                        "boost": 8
                                                    }
                                                }
                                            }, {
                                                "match": {
                                                    "ubc.transcript": {
                                                        "query": "REPLACE_ME",
                                                        "minimum_should_match": "2<-30% 7<-3",
                                                        "lenient": true,
                                                        "boost": 2
                                                    }
                                                }
                                            }, {
                                                "match": {
                                                    "ubc.transcript": {
                                                        "query": "REPLACE_ME",
                                                        "operator": "and",
                                                        "boost": 2
                                                    }
                                                }
                                            }, {
                                                "match": {
                                                    "title": {
                                                        "query": "REPLACE_ME",
                                                        "operator": "and",
                                                        "boost": 10
                                                    }
                                                }
                                            }, {
                                                "match": {
                                                    "title": {
                                                        "query": "REPLACE_ME",
                                                        "minimum_should_match": "2<-30% 9<-3",
                                                        "boost": 6
                                                    }
                                                }
                                            }, {
                                                "match": {
                                                    "collection": {
                                                        "query": "REPLACE_ME",
                                                        "operator": "and",
                                                        "boost": 10
                                                    }
                                                }
                                            }, {
                                                "match": {
                                                    "collection": {
                                                        "query": "REPLACE_ME",
                                                        "minimum_should_match": "2<-30% 7<-3",
                                                        "boost": 7
                                                    }
                                                }
                                            }, {
                                                "match": {
                                                    "creator": {
                                                        "query": "REPLACE_ME",
                                                        "minimum_should_match": "2",
                                                        "boost": 2
                                                    }
                                                }
                                            }]
                                        }
                                    }
                                }
                            };
                        });
            } else {
                return $q.when(defaultQueryObj);
            }
        }

        //  MAKE THE SEARCH STRING
        /********************************/
        searchString.makeString = function (opts) {
            // console.log(opts);
            var searchParams = {};
            // if options are passed, use those, otherwise use the options set in the service
            for (var attr in searchString.vars) {
                if (opts && opts.hasOwnProperty(attr)) {
                    searchParams[attr] = opts[attr];
                } else {
                    searchParams[attr] = searchString.vars[attr];
                }
            }
            // console.log('opts', opts, 'searchParams', searchParams, 'searchString.vars', searchString.vars);
            return setFields(searchParams).then(function () {
                if (isAdvQuery(searchParams.query)) {
                    var thisQuery = {
                        query_string: {
                            default_operator: 'AND',
                            query: searchParams.query
                        }
                    };
                    return makeTheString(thisQuery);
                } else {
                    return getDefaultQueryObj(searchParams.query).then(function (response) {
                        // build bool query from external source
                        var asString = JSON.stringify(response.filtered.query).replace(/REPLACE_ME/g, searchParams.query);
                        var thisQuery = JSON.parse(asString);
                        return makeTheString(thisQuery);
                    });
                }
            });

            // GET FIELD MAPPING DATA from field service, then set mappings for filters, aggs objects (PROMISE)
            function setFields() {
                return fieldService.getMapped(searchParams.fields).then(function (response) {
                    searchParams.fields = response;
                    searchParams.sortObj = buildSortObj(searchParams.sort);
                    if (angular.equals(searchParams.aggsObj, {})) {
                        searchParams.aggsObj = buildAggsObj(searchParams.aggsArr, searchParams.aggSize, searchParams.aggSort);
                    }
                });
            }

            // use to check whether to use 'query string' search instead of 'match'
            function isAdvQuery(input) {
                if (input === '*' || input.match(/AND|OR|NOT/g) || (input[0] === '"' && input[input.length - 1] === '"') || allFieldMatch(input)) {
                    return true;
                }
                else {
                    return false;
                }

                function allFieldMatch(input) {
                    for (var i = 0; i < fieldService.allFieldsArr.length; i++) {
                        var check = new RegExp(fieldService.allFieldsArr[i] + ':', 'gi');
                        // console.log(fieldService.allFieldsArr[i], check);
                        if (input.match(check)) {
                            return true;
                        }
                    }
                }
            }

            // make the querystring
            function makeTheString(thisQuery) {
                var filters = [];
                // check if filters should be omitted, else set them
                if (searchParams.filter && !omit(searchParams.filter)) {
                    filters = getFilters(searchParams.filter) || [];
                }
                var queryObj = {};
                // PICK SEARCH TYPE
                if (searchParams.random) {
                    var min = 10000, max = 1000000;
                    var seed = Math.round(Math.random() * (max - min + 1)) + min;
                    // RANDOM query
                    queryObj = {
                        query: {
                            filtered: {
                                query: {
                                    function_score: {
                                        query: {match_all: {}},
                                        random_score: {
                                            seed: seed
                                        }
                                    }
                                }
                            }
                        }
                    };
                    JSON.stringify(queryObj);  // this one likes to be stringified for some reason.
                } else {
                    queryObj = {
                        sort: searchParams.sortObj,
                        query: {
                            filtered: {
                                query: thisQuery,
                                filter: {
                                    bool: {
                                        must: filters
                                    }
                                }
                            }
                        }
                    };
                }
                // check if query / script object / _source objs should be omitted, else add them
                if (!omit(searchParams.aggsObj)) {
                    queryObj.aggs = searchParams.aggsObj;
                }
                if (!omit(searchParams.scriptFields)) {
                    queryObj.script_fields = searchParams.scriptFields;
                }
                if (!omit(searchParams.fields)) {
                    queryObj._source = searchParams.fields;
                }
                function omit(check) {
                    if (check === 'omit') {
                        return true;
                    } else {
                        return false;
                    }
                }
                // this the stringify escape is causing issues with exact-term searching,
                // but removing it breaks the collection landing page. more testing needed.
                if (searchParams.stringy === true) {
                    return JSON.stringify(queryObj);
                } else {
                    return queryObj;
                }
            }
        };
        
        // BUILD SORT OBJ (fieldSevice.fields must be loaded)
        // takes field and order as input, returns valid ES sort obj.
        // defaults (or use 'false') to _score/desc (relevance)

        function buildSortObj(sort) {
            var sortObj = {};
            if(!sort.field) {
                sortObj =  {
                    "_score": {
                        "order": "desc"
                    }
                }
            } else {
                var rawField = fieldService.fields[sort.field].map + '.raw';
                sortObj[rawField] = {};
                sortObj[rawField].order = sort.order;
            }
            return sortObj;
        }

        // BUILD AGGREGAGES OBJECT (fieldService.fields must be loaded)
        // input: array of field keys, output: aggs object for elasticsearch
        // note: to omit aggregates, use opts.aggsObj = 'omit', if used here causes error with ES.
        function buildAggsObj(aggsArr, s, o) {
            var obj = {}, size = s || 20;
            for (var i = 0; i < aggsArr.length; i++) {
                if (aggsArr[i] === 'sortDate') {
                    obj.sortDate = {
                        date_histogram: {
                            field: "ubc.date.sort",
                            interval: "month",
                            format: "yyyy-MM-dd"
                        }
                    };
                } else if (aggsArr[i] === 'collection') {
                    obj[aggsArr[i]] = {
                        terms: {
                            field: fieldService.fields.nick.map,
                            size: size,
                            order: o
                        }
                    };
                } else {
                    // console.log(aggsArr[i], fieldService.fields);
                    obj[aggsArr[i]] = {
                        terms: {
                            field: fieldService.fields[aggsArr[i]].map + '.raw',
                            size: size,
                            order: o
                        }
                    };
                }
            }
            // console.log('AGGSOBJ', obj);
            return obj;
        }

        // BUILD FILTER OBJECT
        function getFilters(filterVars) {
            var filters = [];
            // add term filters object
            for (var i in filterVars) {
                if (i === 'collection') {
                    // do nothing.
                    // Collections are filtered using Search Index in esSearch.js
                } else {
                    var field = filterVars[i].field,
                        newFilter = {};
                    if (filterVars[i].terms.length > 0) {
                        newFilter.terms = {};
                        if (filterVars[i].terms === undefined) {
                            newFilter.terms[field] = [];
                        } else {
                            newFilter.terms[field] = filterVars[i].terms;
                            newFilter.terms.execution = 'or';
                        }
                        // console.log('newfilter', newFilter);
                        filters.push(newFilter);
                    }
                }
            }

            // add date range object
            if (filterVars.sortDate.begin && filterVars.sortDate.begin.key) {
                // console.log('GETFILTERS DATES');
                var dateRangeFilter = {
                    "range": {
                        "ubc.date.sort": {
                            "gte": filterVars.sortDate.begin.key,
                            "lte": filterVars.sortDate.end.key
                        }
                    }
                };
                filters.push(dateRangeFilter);
            }
            return filters;
        }


        // UTILITY FUNCTIONS
        searchString.makeQueryStr = function (s) {
            s = s.replace(/\s/g, '+');
            return s;
        };
        searchString.makeNaturalStr = function (s) {
            s = s.replace(/\+/g, ' ');
            return s;
        };

        // get page-level hits
        searchString.innerHitsString = function (itemId) {
            var queryObj = {
                fields: [
                    'id',
                    'dc.children.id'
                ],
                query: {
                    match: {
                        id: itemId
                    }
                },
                inner_hits: {
                    matched_children: {
                        path: {
                            'ubc.internal.child.records': {
                                size: 100,
                                query: {
                                    query_string: {
                                        default_field: 'dc.children.dc.transcript',
                                        query: 'searchString.vars.query'
                                    }
                                },
                                highlight: {
                                    require_field_match: false,
                                    pre_tags: [
                                        'UBC_OC_WORD_POSITION_S'
                                    ],
                                    post_tags: [
                                        'UBC_OC_WORD_POSITION_E'
                                    ],
                                    fields: {
                                        'dc.children.dc.transcript': {
                                            type: 'fvh',
                                            fragment_size: 75,
                                            number_of_fragments: 15000
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            };

            return queryObj;
        };

        return searchString;
    }]);

});






