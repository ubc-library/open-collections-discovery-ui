define(function(require){

    var angular = require('angular');
    var services = require('services/services');
    
    // internationalization
    services.factory('i8', function () {
        var language = 'en';
        var i8service = {};
        i8service.setLanguage = function (lang) {
            language = lang;
        };
        i8service.isI8 = function (test, language) {
            if ( typeof(test) === 'string' ) {
                return test;
            } else {
                return test + '.' + language;
            }
        };
        i8service.i8switch = function (field, language) {
            if ( test.language ) {
                return test.language;
            } else {
                return test.en;
            }
        };
        return i8service;
    });
    
});


