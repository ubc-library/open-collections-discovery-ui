
//This service is used to add highlighting to search results
// make sure to call "highlighter.getTerms" when a new search is returned before using highlighter.highlight()


define(function(require){

    var angular = require('angular'),

        dlServices = require('services/searchString'),
        services = require('services/services');
    
    services.factory('highlighter', ['esSearchString', function (searchString) {

            var highlighter = {};

            highlighter.terms = [];

            highlighter.getTerms = function(){

                var query = searchString.vars.query;

                var queryLeft = query;
                var queryQuotes = query.match(/(["'])(?:(?=(\\?))\2.)*?\1/gi);

                // add quoted phrases
                if (queryQuotes){
                    for (var i = 0; i < queryQuotes.length; i++){
                        queryLeft = query.replace(queryQuotes[i], '');
                        queryQuotes[i] = queryQuotes[i].replace(/["']+/g, '').replace(/\s/g, '\\s');
                    }
                }

                // remove problematic punctuation
                queryLeft = queryLeft.replace(/[\.\[\]\(\)\+\*\[\]\{\}\?\|\&]/gi, '');

                // add terms broken by booleans and spaces
                var separators = ['\\sAND\\s+', '\\sOR\\s+', '\\sNOT\\s+', '\\s+'];
                var splitOn = new RegExp(separators.join('|'), 'g');
                
                queryLeft = queryLeft.split(splitOn);

                highlighter.terms = queryLeft.concat(queryQuotes);

                return highlighter.terms;

            };


        highlighter.highlight = function(field){
            
            // does field exist?
            var fld = field;
            if(!fld) { return undefined; }

            // is it a string?
            var isString = false;
            if (typeof fld === 'string'){ 
                isString = true;
                fld = [fld];
            }

            // is the query empty?
            var query = searchString.vars.query;
            if (!query || query === '*') { 
                if (isString){ return fld[0]; }
                return fld;
            }

            // are there terms to use?
            if(!highlighter.terms) { highligher.getTerms();}
            var queryTerms = highlighter.terms;
            // console.log(fld, queryTerms)

            var boolTerms = ['AND', 'OR', 'NOT'];
            var stopwords = ['and','And','a','A', 'an','An','the','The','or','Or','not','Not', 'of', 'Of'];

            var dontHighlight = boolTerms.concat(stopwords);

            // console.log(queryTerms);

            for (var i = 0; i < fld.length; i++){
                for (var ii = 0; ii < queryTerms.length; ii++){
                    // ignore boolean, non-existant, or really problematic matches
                    if(queryTerms[ii] && dontHighlight.indexOf(queryTerms[ii]) === -1){
                        // add highlight
                        // var check = new RegExp('(\\b'+queryTerms[ii]+'\\b)', 'gi');
                        var check = new RegExp('\\b'+queryTerms[ii]+'\\b', 'gi');
                        fld[i] = fld[i].replace(check, function(match, offset){
                            switch(match){
                                case "class" :
                                    var nextChar = fld[i][offset + match.length];
                                    if (nextChar === '='){ return match; }
                                    break;
                                case "span" :
                                    var prevChar = fld[i][offset - 1];
                                    if (prevChar === '<' || prevChar === "/"){ return match; }
                                    break;
                            }
                            return '<span class="dl-highlighted">' + match + '</span>';
                        });
                    }   
                }
            }

            if (isString){ return fld[0]; }
            return fld;

        };

        return highlighter;
    }]);


});
