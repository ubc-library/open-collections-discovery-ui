// This service adds responsive breakpoints with EnquireJS that can be used in the angular app(s)
// use watch & unwatch functions to set or remove breakpoint listeners
// use ismatch & notmatch functions (callbacks) to act on breakpoint changes


define(function(require){

    var angular = require('angular'),
        services = require('services/services'),
        enquire = require('enquire');
    

    // max window size 400 -- this is the cutoff for loading thumbnail images 
    // for list-view on small devices
    services.factory('max400', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
        var max400 = {
            watch: function() { enquire.register('screen and (max-width: 400px)', max400handler); },
            unwatch: function() { enquire.unregister('screen and (max-width: 400px)'); },
            ismatch: function(callback) { $rootScope.$on('match400', callback); },
            notmatch: function(callback) { $rootScope.$on('unmatch400', callback); },
        };
        var max400handler = {
            match: function() {
                $timeout(function(){
                    $rootScope.$emit('match400');
                });
            },
            unmatch: function(){
                $rootScope.$emit('unmatch400');
            }
        };

        return max400;
    }]);


    // max window size 680 -- this is the cutoff for hiding the sidebar
    // services.factory('max680', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
    //     var max680 = {
    //         watch: function() { enquire.register('screen and (max-width: 680px)', max680handler); },
    //         unwatch: function() { enquire.unregister('screen and (max-width: 680px)'); },
    //         ismatch: function(callback) { $rootScope.$on('match680', callback); },
    //         notmatch: function(callback) { $rootScope.$on('unmatch680', callback); },
    //     };
    //     var max680handler = {
    //         match: function() {
    //             $timeout(function(){
    //                 $rootScope.$broadcast('match680');
    //             });
    //         },
    //         unmatch: function(){
    //             $rootScope.$broadcast('unmatch680');
    //         }
    //     };
        
    //     return max680;
    // }]);


});
