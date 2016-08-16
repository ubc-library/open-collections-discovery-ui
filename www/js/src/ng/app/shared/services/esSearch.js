define(function(require){

    var angular = require('angular');
    var services = require('services/services');
    var dlServices = require('services/searchString');
    var dlServices = require('services/collectionData');
    
    services.service('esHost', [ 'esFactory', function (esFactory) {
        return esFactory({
            host: search_api+search_api_endpoint+search_api_search_endpoint+'/search?api_key='+api_key
        });
    } ]);
    // query elasticsearch
    // SEARCH query
    services.factory('esSearchService', [ '$q', '$http', 'esSearchString', 'collectionData',
    function ($q, $http, searchString, collectionData) {
        var s = {};
        s.input = {};
        s.output = {};
        s.search = function (input) {

            // specified searchIndex? if so, change the searchindex
            var nicks;
            if (input.searchIndex) {

                nicks = input.searchIndex;

                if(typeof nicks === 'string'){
                    nicks = [nicks];
                }

                // resolve aggregate collection nicks to full strings with collectionData service, then set index 
                return collectionData.resolveAggs(nicks).then(function(response){
                    // console.log('set index from input.searchIndex', response);
                    input.searchIndex = response;
                    return doSearch();
                });   
            // filtered by collection? if so, change the searchindex
            } else if (searchString.vars.filter.collection.terms.length > 0) {

                nicks = searchString.vars.filter.collection.terms;
                // resolve aggregate collection nicks to full strings with collectionData service, then set index 
                return collectionData.resolveAggs(nicks).then(function(response){
                    if(website_env !== 'prod') {
                        console.log('set index from searchString filters', response);
                    }


                    //!!! first 100 theses is an exception :( !!!
                    if (response.match(/first100theses/gi)){
                        response = response.replace(/first100theses/gi, '831');

                        var tempBody = JSON.parse(input.body);
                        
                        var obj = {
                                    "terms": {
                                        "ubc.internal.repo.handle": [
                                            "2429\/8507",
                                            "2429\/8508",
                                            "2429\/8510",
                                            "2429\/8509",
                                            "2429\/8516",
                                            "2429\/8511",
                                            "2429\/8512",
                                            "2429\/8513",
                                            "2429\/8514",
                                            "2429\/8515",
                                            "2429\/10042",
                                            "2429\/8517",
                                            "2429\/8518",
                                            "2429\/8519",
                                            "2429\/8520",
                                            "2429\/8521",
                                            "2429\/8522",
                                            "2429\/8523",
                                            "2429\/8524",
                                            "2429\/10049",
                                            "2429\/8538",
                                            "2429\/8539",
                                            "2429\/8540",
                                            "2429\/10050",
                                            "2429\/8527",
                                            "2429\/10052",
                                            "2429\/8541",
                                            "2429\/8528",
                                            "2429\/8529",
                                            "2429\/8530",
                                            "2429\/8531",
                                            "2429\/8532",
                                            "2429\/8525",
                                            "2429\/8526",
                                            "2429\/8533",
                                            "2429\/8534",
                                            "2429\/8535",
                                            "2429\/8536",
                                            "2429\/10051",
                                            "2429\/8537",
                                            "2429\/8542",
                                            "2429\/10054",
                                            "2429\/10038",
                                            "2429\/10053",
                                            "2429\/10043",
                                            "2429\/10044",
                                            "2429\/10045",
                                            "2429\/10046",
                                            "2429\/10039",
                                            "2429\/10047",
                                            "2429\/10040",
                                            "2429\/10041",
                                            "2429\/10048",
                                            "2429\/10864",
                                            "2429\/10865",
                                            "2429\/10868",
                                            "2429\/10869",
                                            "2429\/10065",
                                            "2429\/11324",
                                            "2429\/10870",
                                            "2429\/10866",
                                            "2429\/10871",
                                            "2429\/10872",
                                            "2429\/10873",
                                            "2429\/10867",
                                            "2429\/10878",
                                            "2429\/10875",
                                            "2429\/10876",
                                            "2429\/10879",
                                            "2429\/10877",
                                            "2429\/10076",
                                            "2429\/10880",
                                            "2429\/10882",
                                            "2429\/10881",
                                            "2429\/10883",
                                            "2429\/10884",
                                            "2429\/10885",
                                            "2429\/10886",
                                            "2429\/10887",
                                            "2429\/10888",
                                            "2429\/10889",
                                            "2429\/10890",
                                            "2429\/10891",
                                            "2429\/10892",
                                            "2429\/11325",
                                            "2429\/11323",
                                            "2429\/10077",
                                            "2429\/10893",
                                            "2429\/10074",
                                            "2429\/10934",
                                            "2429\/10066",
                                            "2429\/10935",
                                            "2429\/10067",
                                            "2429\/10068",
                                            "2429\/10075",
                                            "2429\/10072",
                                            "2429\/10069",
                                            "2429\/10070",
                                            "2429\/10073",
                                            "2429\/10071"
                                        ],
                                        "execution": "or"
                                    }
                                };
                        tempBody.query.filtered.filter.bool.must.push(obj);

                        input.body = JSON.stringify(tempBody);
                    }
                
                    // if circle only, add dsp limit
                    // if(searchString.dspOnly === 'y'){
                    //     response = 'dsp,' + response;
                    // }

                    input.searchIndex = response;
                    return doSearch();
                });   

            } else {
                // if cIRcle only, dsp index, otherwise main index

                input.searchIndex = (searchString.dspOnly === "y") ? 'dsp' : elasticsearch_main;
                return doSearch();

            }

            function doSearch(){
                // support switching of headers for API Tool
                var headers = {
                            'Content-Type'    : 'application/x-www-form-urlencoded',
                            'X-Requested-With': 'XMLHttpRequest'
                        };
                if(input.headers){
                    for (var prop in input.headers){
                        headers[prop] = input.headers[prop];
                    }
                }

                // if(!input.type) { input.type = 'object';}
                if(website_env !== 'prod') {
                    console.log('search input:', input);
                }
                
                return $http.post(
                    search_api+search_api_endpoint+search_api_search_endpoint+'?api_key='+api_key,
                    {
                        from : input.from,
                        size : input.size,
                        body : input.body,
                        index: input.searchIndex, // SL says: probably best not to mess with this as all collection filtering depends on it.
                        type : 'object',
                        search_type: input.search_type
                    },
                    {
                        headers: headers
                    })
                    .then(
                    function (response) {
                        if(website_env !== 'prod') {
                            console.log('response:', response);
                        }
                        var result = response.data.data.data;
                        var output = {
                            // hits: response.hits,
                            results: result.hits.hits,
                            total  : result.hits.total,
                            aggs   : result.aggregations
                        };
                        // debugger;
                        if(website_env !== 'prod') {
                            // console.log('search output:', output);
                        }
                        // s.output = output;   
                        return output;
                        // deferred.resolve(s.output);
                    },
                    function (error) {
                        console.trace('ES query error:', error);
                        return error;
                    });
            }

        };
        // search inside a compound object. use searchString.innerHitsString() to make body.
        s.searchInside = function(body){
            var deferred = $q.defer();
            s.input.searchIndex = s.input.searchIndex || elasticsearch_main;
             $http.post(
                search_api+search_api_endpoint+search_api_search_endpoint+'?api_key='+api_key,
                {   
                    from : 0,
                    size : 100,
                    body : body,
                    index: s.input.searchIndex,
                    type : 'object'
                },
                {   
                    headers: {
                        'Content-Type'    : 'application/x-www-form-urlencoded',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                })
                .then(
                function (response) {
                    if(website_env !== 'prod') {
                        console.log('innerSearchResponse:', response);
                    }
                    var result = response.data.data.data;
                    if(website_env !== 'prod') {
                        console.log('serachInside:', result);
                    }
                    var innerHits = result.hits.hits[0].inner_hits.matched_children.hits;
                    deferred.resolve(innerHits);
                },
                function (reject) {
                    console.log('reject:', reject);
                    deferred.reject(reject);
                });
            return deferred.promise;

        };
        return s;
    } ]);
});


