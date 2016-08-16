// TICKETS: DL-499

define(function (require) {
    // "use strict";
    var angular = require('angular');
    // Services Module
    var services = angular.module('dlServices', []);
    // initialize elasticsearch client

    // Template CACHING
    services.factory('tCache', ["$rootScope", "$templateCache", "$http", function($rootScope, $templateCache, $http){
        var tCache = {};

        tCache.templatePath;

        tCache.clearCache = function(){
            // FOR DEV ONLY:: CLEAR TEMPLATE CACHE
            if (website_env && website_env==='dev') {
                console.log('CLEAR TEMPLATE CACHE');
                $rootScope.$on('$viewContentLoaded', function() {
                   $templateCache.removeAll();
                 });
            };
        };
        // pre cache templates (takes array of template names)
        tCache.getTemplates = function(input) {
            for (var i=0; i < input.length; i++) {
                $http.get(tCache.templatePath + input[i] + '?version='+app_version, { cache:$templateCache });
            }
        };

        return tCache;
    }]);

    // utility
    services.factory('utility', function () {
        var utility = {};
        utility.isEmpty = function (obj) {
            for ( var prop in obj ) {
                if ( obj.hasOwnProperty(prop) )
                    return false;
            }
            return true;
        };
        utility.removeFromArray = function (array, item) {
            var index = array.indexOf(item);
            if ( index === -1 ) {
                return;
            } else {
                array.splice(index, 1);
            }
        };
        utility.arrayAddRemove = function (array, item) {
            var index = array.indexOf(item);
            
            if ( index === -1 ) {
                array.push(item);
            } else {
                array.splice(index, 1);
            }
        };
        utility.objArrayAddRemove = function(array, item, prop){
            var index = -1;

            for (var i = 0, len = array.length; i < len; i++){
                if (array[i][prop] === item[prop]) {
                    index = i;
                }
            }

            if ( index === -1 ) {
                array.push(item);
            } else {
                array.splice(index, 1);
            }
        };

        utility.getKeyByValue = function(obj, value){
            for( var prop in obj ) {
                 // if( obj.hasOwnProperty( prop ) ) {
                      if( obj[ prop ] === value )
                          return prop;
                 // }
             }
         };

        // Detect IE version -- better to use object detection instead where possible!
        utility.ieVersion = function(){

            var iev=0;
            var ieold = (/MSIE (\d+\.\d+);/.test(navigator.userAgent));
            var trident = !!navigator.userAgent.match(/Trident\/7.0/);
            var rv=navigator.userAgent.indexOf("rv:11.0");

            if (ieold) iev=new Number(RegExp.$1);
            if (navigator.appVersion.indexOf("MSIE 10") != -1) iev=10;
            if (trident&&rv!=-1) iev=11;

            return iev;         
   
        };

        utility.windowstop = function(){
            // ie doesn't have window.stop, so if it doesn't exist, use execCommand instead
            if(typeof window.stop === 'function'){
                window.stop();
            } else if (typeof document.execCommand === 'function'){
                document.execCommand("Stop");
            }
        };

        utility.objToArray = function(obj){
            var arr = [];
            for (var prop in obj) {
                arr.push(obj[prop]);
            }
            return arr;
        };

        // remove default dates (0001-01-01) and discard dates more than 5 years in the future
        // accepts array from elasticsearch date_hist aggregation
        var dateCeiling = Date.now() + 31556952000*5;
        utility.cleanDates = function(arr){
            // console.log('cleanDates', arr, console.log(dateCeiling));
            var newArr =[];
            for(var i=0; i < arr.length; i++){                        
                if (arr[i].key_as_string.split(" ").indexOf("0001-01-01") > -1 || arr[i].key > dateCeiling) {
                    // console.log(arr[i]);
                    // do nothing
                } else {
                    newArr.push(arr[i]);
                }
            }
            // console.log(newArr)
            return newArr;
        };

        // Always be a string
        utility.mustBeString = function(input){
            if ( typeof input === 'string') {
                return input;
            } else {
                return input[0];
            }
        };
        
        // GOOGLE ANALYTICS EVENT UTILITY
        utility.gaEvent = function(category, action, label){
            try {
                _gaTracker('secondTracker.send', {
                  hitType: 'event',
                  eventCategory: category,
                  eventAction: action,
                  eventLabel: label
                });
            } catch(e) {
                if (website_env != 'prod') {
                    console.log('GA Event: ', category, action, label);
                    // console.error('error sending GA event:', category, action, label, e);
                } else {
                    console.error(e);
                }
            }
        };

        utility.gaPageview = function(loc) {
            try {
                _gaTracker('set', 'page', loc);
                _gaTracker('send', 'pageview');
                _gaTracker('secondTracker.set', 'page', loc);
                _gaTracker('secondTracker.send', 'pageview');
            } catch(e) {
                if (website_env != 'prod') {
                    console.log('GA pageview', loc);
                    // console.error('error sending GA event:', category, action, label, e);
                } else {
                    console.error(e);
                }
            }
        };
        
        return utility;
    });


    // not really a services but these directive live here so they can be loaded in all dl angular apps
    services.directive('linkOut', function(){
        return {
            restrict:'A',
            link: function(scope, element, attr){
                element.attr('target', '_self')
                    .on('click',function(){
                        window.stop();
                    });
            }
        };
    });

    services.directive('clickselect', function(){
        return {
            restrict:'A',
            link: function(scope, element, attr){
                element.focus(function() {
                    element.select();
                    // Work around Chrome's little problem
                    element.mouseup(function() {
                        // Prevent further mouseup intervention
                        element.onmouseup = null;
                        return false;
                    });
                });
            }
        };
    });

    // Google Analytics Event Directive
    // usage: ga-event="category,action,label" for static vals 
    // OR ga-event action="{{ scope_var }}" for 
    services.directive('gaEvent', ['utility', function(utility){
        return {
            restrict:'A',
            scope: {
                category: '@',
                action: '@',
                label: '@'
            },
            link: function($scope, element, attr){
                if (typeof attr.gaEvent === 'string') {
                    var attrs = attr.gaEvent.split(',');
                    element.on('mouseup', function() {
                        utility.gaEvent(attrs[0], attrs[1], attrs[2]);
                    });
                } else {
                    element.on('mouseup', function(){
                        utility.gaEvent($scope.category, $scope.action, $scope.label);
                    });
                }

            }
        };
    }]);
    // use this to capture 'copy' event in textareas or inputs
    services.directive('gaCopyEvent', ['utility', function(utility){
        return {
            restrict:'A',
            scope: {
                category: '@',
                action: '@',
                label: '@'
            },
            link: function($scope, element, attr){
                var attrs = attr.gaCopyEvent.split(',');
                element.on('focus', function() {
                    $(document).bind('keydown', function(e) {
                        if (e.keyCode == 67 && (e.ctrlKey || e.metaKey)) {
                            /* close fancybox here */
                            utility.gaEvent(attrs[0], attrs[1], attrs[2]);
                        }
                    });  
                }).on('focusout', function(){
                    $(document).unbind('keydown');
                });
            }
        };
    }]);
    return services;
});
