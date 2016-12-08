/* @author - Kevin Ho (kevho99@mail.ubc.ca) */
/* Updated @schuyberg 6/2015 -  depends on output from 'advanced search' widget builder */
/* @JIRA - DL-169 DL-61 */
/*jslint browser: true*/
/*global jQuery:false */
(function() {

    // config vars
    // NOTE: these should be updated here for use in other systems.
    var backendURL = "https://oc-index.library.ubc.ca";
    var serverURL = "https://open.library.ubc.ca";
    var queryStringUrl = "https://oc-index.library.ubc.ca/_queryString";
    var styleSheetPath = "/stylesheets/css/embed/search.css";
    var widgetBoxName = "#ocw-attach-search";
    var voyagerBibId = 'http://webcat1.library.ubc.ca/vwebv/holdingsInfo?bibId=';

    // Assign external variables
    var script = document.getElementById("dl-search");
    var placeholderText = script.getAttribute("data-placeholder") ? script.getAttribute("data-placeholder") : "Search the Open Collection...";
    // check for proper hex colour code
    var themeColor = hexToRgb((/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(script.getAttribute("data-color"))) ? script.getAttribute("data-color") : '#002145');
    var themeColor = hexToRgb((/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(script.getAttribute("data-color"))) ? script.getAttribute("data-color") : '#002145');
    var inlineResult = (script.getAttribute("data-inline") !== null && script.getAttribute("data-inline").toLowerCase() === 'true') ? true : false;
    var apikey = script.getAttribute("data-apikey") ? script.getAttribute("data-apikey") : 'ac40e6c2cb345593ed1691e0a8b601bba398e42d85f81f893c5ab709cec63c6c';
    var keepQuery = (script.getAttribute("data-keep-query") !== null && script.getAttribute("data-keep-query").toLowerCase() === 'true') ? true : false;
    var queryString = script.getAttribute("data-query-string") ? script.getAttribute("data-query-string") : '';

    var filterString = script.getAttribute("data-filter-string") ? JSON.parse(script.getAttribute("data-filter-string")) : '';
    var queryObj = script.getAttribute("data-query-obj") ? JSON.parse(script.getAttribute("data-query-obj")) : '';
    var from = queryObj.from;
    var size = queryObj.size;

    var thisLocation = window.location.href.split('?')[0];

    console.log(queryObj);

    var debug = (script.getAttribute("data-debug") !== null && script.getAttribute("data-debug").toLowerCase() === 'true') ? true : false;

    jQuery('head').append('<link rel="stylesheet" href="' + serverURL + styleSheetPath + '" type="text/css" />');

    // Build HTML code
    var output = "";

    output += "<div id='dl-searchBox'>";
    output += "<button id='dl-searchButton' type='text'>";
    // SVG icon craziness follows
    output += '<svg id="dl-searchIcon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="216px" height="146px" viewBox="0 0 216 146" enable-background="new 0 0 216 146" xml:space="preserve"><path d="M172.77 123.025L144.825 95.08c6.735-9.722 10.104-20.559 10.104-32.508c0-7.767-1.508-15.195-4.523-22.283 c-3.014-7.089-7.088-13.199-12.221-18.332s-11.242-9.207-18.33-12.221c-7.09-3.015-14.518-4.522-22.285-4.522 c-7.767 0-15.195 1.507-22.283 4.522c-7.089 3.014-13.199 7.088-18.332 12.221c-5.133 5.133-9.207 11.244-12.221 18.3 c-3.015 7.089-4.522 14.516-4.522 22.283c0 7.8 1.5 15.2 4.5 22.283c3.014 7.1 7.1 13.2 12.2 18.3 c5.133 5.1 11.2 9.2 18.3 12.222c7.089 3 14.5 4.5 22.3 4.522c11.951 0 22.787-3.369 32.509-10.104l27.945 27.9 c1.955 2.1 4.4 3.1 7.3 3.096c2.824 0 5.27-1.032 7.332-3.096c2.064-2.063 3.096-4.508 3.096-7.332 C175.785 127.5 174.8 125 172.8 123.025z M123.357 88.357c-7.143 7.143-15.738 10.714-25.787 10.7 c-10.048 0-18.643-3.572-25.786-10.714c-7.143-7.143-10.714-15.737-10.714-25.786c0-10.048 3.572-18.644 10.714-25.786 c7.142-7.143 15.738-10.714 25.786-10.714c10.048 0 18.6 3.6 25.8 10.714c7.143 7.1 10.7 15.7 10.7 25.8 C134.072 72.6 130.5 81.2 123.4 88.357z"/></svg>';
    output += "</button>";
    output += "<span id='dl-searchSpan'><input id='dl-searchInput' type='text' placeholder='" + placeholderText + "'/></span>";
    output += "</div>";
    output += "<div id='dl-resultBox'>";
    output += "</div>";

    function customTheming() {
        var colour = rgbaString(themeColor, 1);
        jQuery("#dl-searchButton").css('background-color', colour);
        jQuery(".dl-pagination-ul li").css('border-color', colour);
        jQuery(".dl-pagination-ul li.current").css('background-color', colour);
        jQuery("#dl-resultBox .dl-highlighted").css('background-color', rgbaString(themeColor, 0.15));
    }

    function inputClean(str) {
        var input = str;
        return input;
    }
    
    function hexToRgb(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function rgbaString(colour, alpha) {
        return "rgba(" + colour.r + "," + colour.g + "," + colour.b + "," + alpha + ")";
    }


    // User Behaviours
    jQuery(document).ready(function () {

        // Sean: Loading the widget box here so the <div> can be anywhere on the page.
        jQuery(widgetBoxName).html(output);

        // Apply external variables
        customTheming();

        jQuery("#dl-searchButton").hover(function () {
            jQuery(this).find('path').css('fill', rgbaString(themeColor, 1));
        }, function () {
            jQuery(this).find('path').css('fill', 'white');
        });

        // Click the search button
        jQuery("#dl-searchButton").click(function (e) {
            submitSearch(jQuery("#dl-searchInput").val(), e);
        });

        jQuery("#dl-searchInput").keyup(function (e) {
            // If user presses 'Enter' key
            if (e.keyCode == 13) {
                submitSearch(jQuery("#dl-searchInput").val(), e);
            }
        });

        //Set intial saved search query if keepQuery == true
        if (keepQuery) {
            jQuery("#dl-searchInput").val(queryString);

            if(inlineResult){
                ocSearch(queryObj);
            }

        }

        function submitSearch(query, e) {              
            if (debug) { console.log(query); }
            if (!inlineResult) {
                returnOffsite(query);
            } else {
                returnInline(query, e);
            }
        }    
        function returnOffsite (query) {
            window.location.href = serverURL + "/search?q=" + query + filterString +'&widgetquery=' + thisLocation;            
        }
        function returnInline (query, e) {
            e.preventDefault();
            queryObj.from = 0; // Reset pagination for new searches     
            queryObj.body.query.filtered.query.query_string.query = query || '*';       
            ocSearch(queryObj);
        }

        // Call out to search engine to get results
        function ocSearch (query) {
            var thisQuery = jQuery.extend({}, query);    
            thisQuery.body = JSON.stringify(thisQuery.body);
            
            // console.log(backendURL, thisQuery);
            jQuery.ajax(
                backendURL + '/search?api_key=' + apikey,
                {
                    type: "POST",
                    dataType: "json",
                    headers: {
                        'Content-Type'    : 'application/x-www-form-urlencoded',
                        'X-Requested-With': 'XMLHttpRequest'
                    }, 
                    data: JSON.stringify(thisQuery),
                    beforeSend: function () {        
                        var resultBox = jQuery("#dl-resultBox");
                        resultBox.width(jQuery("#dl-searchBox").width() - 22);
                        // if (resultBox.html().length <= 0) {
                            resultBox.html("Loading...").fadeIn(150);
                        // }                        
                    },
                    success: function(data) {
                        
                        // Write results to page

                        jQuery("#dl-resultBox").html(formatResult(data.data.data.hits)).fadeIn(150); 
                        paginationLink(); // Apply highlighting   
                        customTheming();  
                        jQuery(document).mouseup(function(e) {
                            var resultBox = jQuery("#dl-resultBox");
                            if (!resultBox.is(e.target) && resultBox.has(e.target).length === 0) {
                                resultBox.fadeOut(150);
                                resultBox.empty();
                                jQuery(document).unbind('mouseup');
                            }
                        });
                    },
                    error: function() {
                        jQuery("#dl-resultBox").html("An error with the search has occurred.").fadeIn(150);  
                    }        
                }
            );
        }


        // Creates search results HTML
        function formatResult (result) {
            // console.log(result); 
            var htmlString = "";
            if (result.total < 1) {
                htmlString = "0 results found.";
            } else {
                htmlString = "<ol class='results' start='" + (queryObj.from+1) + "'>";
                jQuery.each(result.hits, function(key, value) {
                    var handle = checkField(value,'ubc.internal.handle').split('.');
                    var colNick = checkField(value, 'ubc.internal.provenance.nick');
                    var title = checkField(value, 'title');
                    var sortDate = checkField(value, 'ubc.date.sort');
                    var creator = checkField(value, 'creator');

                    var itemLink = (checkField(value, 'ubc.internal.repo') === 'vyg') ? voyagerBibId + checkField(value, 'ubc.internal.repo.handle') : serverURL + '/collections/' + colNick + '/items/' + value._id ;

                    htmlString += '<li>';
                    htmlString += '<a href="' + itemLink + '">' + title + '</a><br>'; 
                    // htmlString += partOf + '<br>'; 
                    htmlString += '<small>' + creator + ', ' + sortDate + '</small>'; 
                    htmlString += '</li>'; 
                });
                htmlString += "</ol>";
                htmlString += pagination(result.total, queryObj.from, size);
            }
            return htmlString;
        }

        // Check if the metadata field even exists, return value or unknown
        function checkField(val, field){
            // console.log(val, field);
            if (val._source && val._source[field]){
                if (typeof val._source[field] === 'string'){
                    return val._source[field];
                } else {
                    return val._source[field][0];
                }
            } else {
                return '[unknown]';
            }
        }

        // Creates logic for pagination 
        function pagination(total, from, size) {    
            var totalPages = Math.ceil(total/size);
            var currentPage = Math.round(from/size) + 1;
            var pages = [1, currentPage, totalPages];

            if (currentPage == 1) { pages.push(2, 3); } // currently first page
            else if (currentPage == totalPages) { pages.push(totalPages-1, totalPages-2); } // currently last page
            else { pages.push(currentPage-1, currentPage+1); }

            pages = paginationSort(pages, totalPages);

            return paginationMarkup(pages, currentPage);
        }    

        // de-dupes and sorts pagination array
        function paginationSort(arr, max) {
            var seen = {};
            arr = arr.filter(function(page) {
                // eliminate pages duped or out of range
                return (seen.hasOwnProperty(page) || page > max || page < 1) ? false : (seen[page] = true); 
            }).sort(function(a, b) {
                // sort ascending
                return a-b;
            });
            return arr;        
        }

        // Create pagination HTML markup
        function paginationMarkup(pages, currentPage) {
            var result = "<div style='text-align: center'><ul class='dl-pagination-ul'><li data-page='" + (currentPage == 1 ? currentPage : currentPage-1) + "' class='" + (currentPage == 1 ? "current" : "") + "'>&#171;</li>";

            // Loop through pages
            for (var i=0; i < pages.length; i++) {
                if (i !== 0 && (pages[i] - pages[i-1] != 1)) { result += " ... "; }
                result += "<li data-page='" + pages[i] + "' class='" + (currentPage == pages[i] ? "current" : "") + "'>" + pages[i] + "</li>";
            }                

            result += "<li data-page='" + (currentPage == pages[pages.length-1] ? currentPage : currentPage+1) + "' class='" + (currentPage == pages[pages.length-1] ? "current" : "") + "'>&#187;</li></ul></div>";
            return result;
        }

        // Apply pagination links AJAX callbacks
        function paginationLink() {
            jQuery('.dl-pagination-ul li').not('.current').click(function() {
                queryObj.from = (jQuery(this).data('page')-1) * size;
                ocSearch(queryObj);
            });
        }

    });

})();