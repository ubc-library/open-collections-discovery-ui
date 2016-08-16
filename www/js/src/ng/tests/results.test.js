//tests for results.js
'use strict';
 

describe('Unit: search controller', function(){
    
	beforeEach(function(){
        module('dlApp.results');

        module(function($provide){
            $provide.service('esFactory', esHost);
        });
    });


    var scope;
	
	beforeEach(inject(function($rootScope, $controller){
        //create an empty scope
        scope = $rootScope.$new();
        //declare the controller and inject our empty scope
        // $controller('searchController', {$scope: scope});
        $controller('searchController', {
            $scope : scope
        });
    }));
	
	// tests start here
    it('does scope exist', function(){

       expect(scope);

    });
	
 });	
 