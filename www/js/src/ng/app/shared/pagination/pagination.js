define(function (require) {

    var angular = require('angular');

    // path to templates for directives
    var templatePath = js_base_url + "ng/app/shared/pagination/templates/";

    // Define Module (in this case, a standalone "App" for )
    // var results = angular.module('dlApp.results', ['elasticsearch']);

    var pagination = angular.module('dlPagination', ['dlServices', 'dlFilters']);

    pagination.controller('paginationController', ['$scope', 'esSearchService', 'pageService', '$anchorScroll',
        function($scope, es, pVars, $anchorScroll) {

            $scope.pVars = pVars;
            $scope.$watch('pVars.total', function(newVal, oldVal){
                init();
            });
            $scope.$watch('pVars.perPage', function(newVal, oldVal){
                init();
            });

            function init(){
                pVars.init();
                $scope.currentPage = pVars.currentPage;
                $scope.from = pVars.from +1;
                $scope.to = pVars.to;
                $scope.pageRange = pVars.pageRange;
            }

            $scope.prevPage = function () {
                if (pVars.currentPage > 0) {
                    pVars.currentPage--;
                    turnPages();
                }
            };

            $scope.nextPage = function () {
                if (pVars.currentPage < pVars.pages - 1) {
                    pVars.currentPage++;
                    turnPages();
                }

            };

            $scope.setPage = function (p) {
                pVars.currentPage = p;
                turnPages();
            };

            function turnPages(){
                pVars.update();
                pVars.change();
                // $scope.$emit('pageChange');
                //console.log('pageChange');
                $scope.currentPage = pVars.currentPage;
                $scope.from = pVars.from +1;
                $scope.to = pVars.to;
            }
    }]);

    pagination.directive('pagination', function() {
        return {
            scope: '=',
            controller: 'paginationController',
            restrict: 'A',
            templateUrl: templatePath + 'pagination.html?version='+app_version
        };
    });


    // pagination vars service (to share vars between controllers)

    pagination.factory('pageService', ['$rootScope', function($rootScope){

        var pVars = {
            total: 0,
            perPage: 30,
            currentPage: 0,
            from: 0
        };

        pVars.changed = function(callback){
            $rootScope.$on('pageChange', callback);
        };
        // notify application of changes to facets (emit has way better performance than broadcast)
        // use pagination.change(); 
        pVars.change = function(){
            $rootScope.$emit('pageChange');
        };

        pVars.init = function(){
            pVars.pages =  Math.ceil(pVars.total / pVars.perPage);
            pVars.pageRange = [];
            for (var i = 0; i <= pVars.pages-1; i++){
                 pVars.pageRange.push(i);
            }
            pVars.update();
        };

        pVars.update = function(){
            pVars.from = pVars.perPage * pVars.currentPage;
            if (pVars.total < pVars.from + pVars.perPage){
                pVars.to = pVars.total;
            } else {
                pVars.to = pVars.from + pVars.perPage;
            }
            // console.log('pagination update', pVars);
        };

        return pVars;
    }]);


return pagination;
});