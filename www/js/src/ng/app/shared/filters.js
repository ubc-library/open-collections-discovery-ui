define(function (require) {

    var angular = require('angular');

    var dlFilters = angular.module('dlFilters', []);
    /****** common filters ******/
    dlFilters.filter('capitalize', function () {
        return function (input, scope) {
            if (input !== null) {
                input = input.toLowerCase();
                return input.substring(0, 1).toUpperCase() + input.substring(1);
            }
        };
    });
    dlFilters.filter('orderObjectBy', function () {
        return function (input, attribute, reverse) {
            if (!angular.isObject(input)) {console.log('return err'); return input; }
            var array = [];
            for (var objectKey in input) {
                array.push(input[objectKey]);
            }
            array.sort(function(a,b){
                var sortA = naturalSort(a[attribute]);
                var sortB = naturalSort(b[attribute]);

                function naturalSort(input){
                    if(typeof input === 'string'){
                        input = input.replace(/the | |a |an /i, '');
                        input = input.toLowerCase();
                        return input;
                    } else {
                        return input;
                    }
                }

                if (sortA < sortB) {
                    return -1;
                } else if (sortA > sortB) {
                    return 1;
                } else {
                    return 0;
                }


            });
            if(reverse === 'reverse'){
                return array.reverse();
            }
            return array;
        };
    });

    dlFilters.filter('stripHtmlTags', function() {
        return function(input) {
            // remove tags
            var string = String(input).replace(/<[^>]+>/gm, '');
            // decode html encoded characters using a text area
            var txt = document.createElement("textArea");
            txt.innerHTML = string;
            return txt.value;
        };
    });

    dlFilters.filter('limitToWords', function(){
        return function (value, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }

            return value + (tail || '...');
        };
    });

    // format dates
    dlFilters.filter('formatSortDate', ["$filter", function($filter){

        return function (input) {

            if(input !== null){
                // replace default sort dates with 'uknown'
                if(input === "0001-01-01 AD") {
                    return "[date unknown]";
                }  

                var year,
                    date = input.split(" ")[0],
                    era = input.split(" ")[1],
                    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

                if (era === "BC") {
                    return input;
                }

                date = date.replace(/\d{4}/g, function(matched){
                    year = matched;
                    return '';
                });

                if ( date === '-12-31') {
                    date = year;
                } else {
                    var moDay = date.match(/\d{2}/g);
                    if(moDay){
                        date = months[moDay[0] -1] + ' ' + moDay[1] + ', ' + year;
                    } else {
                        date = year + ' ' + date;
                    }
                }
                return date;
            }
        };
    }]);

    // dlFilters.filter('makeDateObj'), ["$filter", function($filter){
    //     return function (input) {
    //         if(input != null){
    //             var ad = /\s([AD])\w/;
    //             var d = input.replace(ad, '');

    //             return new Date(d);
    //         }
    //     };
    // }]);



return dlFilters;

});