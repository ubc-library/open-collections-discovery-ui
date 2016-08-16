// This service stores and creates search fields data for the API and Advanced Search tools

define(function(require){

    var angular = require('angular'),
        services = require('services/services');
        dlServices = require('services/fieldService'); 

    services.factory('apifields', ['fieldService', '$q', function (fieldService, $q) {
        var apifields = {};
        apifields.selectTemplate = js_base_url + "ng/app/shared/templates/apifields.html";        

        var theFields = {};
        var defaultFields = ['creator', 'title', 'subject', 'description'];


        apifields.getFields = function() {
            if (angular.equals(theFields, {})){
                return fieldService.getFields(fieldService.advSearchFields).then(function(response){
                    var output = {};
                    for (var f in response){
                       if(!response[f].map.match(/internal/)){
                           output[f] = response[f];
                           if(defaultFields.indexOf(f) > -1){
                                output[f].selected = true;
                           } else {
                                output[f].selected = false;
                           }
                       }
                    } 
                    theFields = output;
                    return output;
                });   
            } else {
                return $q.when(theFields);
            }
            
        };

        apifields.getSelected = function(mapped){
            var arr = [];
            for (var f in theFields){
                if (theFields[f].selected) {
                    if(mapped === 'mapped'){
                        arr.push(theFields[f].map);
                    } else {
                        arr.push(f);
                    }
                }
            }
            return arr;
        };


        // obsolete.
        // apifields.selections = function(){
        //     var objArr = [];
        //     for (var i = 0; i < apifields.fields.length; i++) {
        //         var obj = {
        //             field: apifields.fields[i],
        //             selected: defaults.indexOf(apifields.fields[i]) > -1 ? true : false
        //         };
        //         objArr.push(obj);
        //     }
        //     return objArr;
        // };

        // apifields.selected = function(input){
        //     var arr = [];
        //     angular.forEach(input, function(d,i){
        //         if (d.selected){
        //             arr.push(d.field);
        //         }
        //     });
        //     return arr;
        // };

        return apifields;
    }]);

});
