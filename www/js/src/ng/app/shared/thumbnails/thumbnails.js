define(function (require) {

    var angular = require('angular');
    var $ = require('jquery');

    // path to templates for directives
    var templatePath = js_base_url + "ng/app/shared/thumbnails/templates/";

    // Define Module (in this case, a standalone "App" for )
    var dlServices = require('services/collectionData'),
        dlFilters = require('filters');

    var thumbnails = angular.module('dlThumbs', ['dlServices', 'dlFilters']);

    thumbnails.controller('thumbnailsController', ['$scope', 'thumbService', 'collectionData', '$timeout', '$http', '$templateCache',
        function($scope, thumbService, collectionData, $timeout, $http, $templateCache) {

        // cache templates up front 
        $http.get(templatePath + 'basic-thumb.html?version='+app_version, { cache:$templateCache });
        $http.get(templatePath + 'rich-thumb.html?version='+app_version, { cache:$templateCache });
        $http.get(templatePath + 'rich-thumb-no-link.html?version='+app_version, { cache:$templateCache });

        $timeout(function(){  // timeout ensures vars are in place before thumbs load
            $scope.noThumb = false;

            $scope.src = thumbService.thumbSrc($scope.width, $scope.repo, $scope.itemId, $scope.colNick, $scope.handle);
            if(!$scope.src) { $scope.noThumb = true;}
            if($scope.itemId) {
                collectionData.getTitle($scope.colNick).then(function(response){
                    var nick = (response && response.nick) ? response.nick : $scope.colNick;

                    if($scope.repo == 'dsp') {
                        if($scope.colNick != nick) {
                            $scope.itemLink = 'cIRcle/collections/' + nick + '/' +$scope.colNick + '/items/' + $scope.itemId;
                        } else {
                            $scope.itemLink = 'cIRcle/collections/' + nick + '/items/' + $scope.itemId;
                        }
                    }
                    else if($scope.colNick != nick) {
                        $scope.itemLink = 'collections/' + nick + '/' +$scope.colNick + '/items/' + $scope.itemId;
                    }
                    else {
                        $scope.itemLink = 'collections/' + nick + '/items/' + $scope.itemId;
                    }

                },function(error){
                    console.log('UNABLE TO RESOLVE NICK', $scope.colNick);
                });
            } else {
                collectionData.getTitle($scope.colNick).then(function(response){
                    var nick = (response && response.nick) ? response.nick : $scope.colNick;
                    //console.log(nick, $scope.colNick, $scope.repo );
                    if($scope.repo == 'dsp' || $scope.repo == 'circle') {
                        if($scope.colNick != nick) {
                            $scope.itemLink = 'cIRcle/collections/' + nick + '/' +$scope.colNick;
                        } else {
                            $scope.itemLink = 'cIRcle/collections/' + nick;
                        }
                    }
                    else if($scope.colNick != nick) {
                        $scope.itemLink = 'collections/' + nick + '/' +$scope.colNick;
                    }
                    else {
                        $scope.itemLink = 'collections/' + nick;
                    }
                    //console.log($scope.itemLink);
                },function(error){
                    console.log('UNABLE TO RESOLVE NICK', $scope.colNick);
                });
            }


            if($scope.clickEvent){
                $scope.imgClick = 'event';
                $scope.link = '$scope.$parent.' + $scope.clickEvent;
            } else {
                $scope.link = thumbService.thumbLink( $scope.colNick, $scope.itemId );
                // console.log("link!", $scope.link);
            }

        }, 0);

    }]);

    thumbnails.directive('basicThumb', function() {
        return {
            // scope vars are set through directive attributes in html tag
            scope: {
                itemId: "@itemId",
                handle: "@handle",
                width: "@imgWidth",
                type: "@type",
                title: "@itemTitle",
                repo: "@repo",
                colNick: "@colNick"
            },
            transclude: true,
            controller: 'thumbnailsController',
            restrict: 'AE',
            templateUrl: templatePath + 'basic-thumb.html?version='+app_version,
            link: function($scope, element, attrs){
               thumbLink($scope, element, attrs);
            }
        };
    });

    thumbnails.directive('richThumb', ["utility", function(utility) {
        return {
            // scope vars are set through directive attributes in html tag
            scope: {
                itemId: "@itemId",
                handle: "@handle",
                width: "@imgWidth",
                type: "@type",
                title: "@itemTitle",
                htmlTitle: "@htmlTitle",
                repo: "@repo",
                colNick: "@colNick"
            },
            transclude: true,
            controller: 'thumbnailsController',
            restrict: 'AE',
            templateUrl: templatePath + 'rich-thumb.html?version='+app_version,
            link: function($scope, element, attrs){
               thumbLink($scope, element, attrs);

               // add GA event tracking for collection and item page thumbs
               if(typeof colId !== 'undefined'){
                    element.on('mouseup', function(e){
                        utility.gaEvent('collection_landing', 'thumbnail_click');
                    });
               } else if (element.parents('#relatedItems')){
                    element.on('mouseup', function(e){
                        utility.gaEvent('item_page','thumbnail_click','related_items');
                    });
               }
            }
        };
    }]);

    function thumbLink($scope, element, attrs){
        var img = element.find('img');
        // depends on full jQuery(!)
                element.find('img').on("error", function(){
                    $scope.noThumb = true;
                    $scope.$apply();
                    $(this).css('background', 'none');
                });
                img.on('load', function(){
                    $(this).css('background', 'none');
                });
    }

    thumbnails.directive('richThumbNoLink', function() {
        return {
            // scope vars are set through directive attributes in html tag
            scope: {
                itemId: "@itemId",
                handle: "@handle",
                width: "@imgWidth",
                type: "@type",
                colNick: "@colNick",
                title: "@itemTitle",
                repo: "@repo"
            },
            transclude: true,
            controller: 'thumbnailsController',
            restrict: 'AE',
            templateUrl: templatePath + 'rich-thumb-no-link.html?version='+app_version
        };
    });

    // thumbnails vars service (to share vars between controllers)

    thumbnails.factory('thumbService', [ '$q', '$http', '$filter',
        function ($q, $http, $filter) {
            var thumb = {};

            thumb.thumbSrc = function(size, repo, itemId, colNick, handle) {
                if(handle) {
                    var splitHandle = split(handle, '.', 2);
                    // console.log(splitHandle);
                    repo = splitHandle[0];
                    colNick = splitHandle[1];
                    itemId = splitHandle[2];
                }
                return website_base_url + '/img/thumbnails/'+repo+'/'+colNick+'/'+400+'/'+ itemId;
            };

            thumb.thumbLink = function(colNick, id){
                if (!id || id.length == 0) {
                    return website_base_url + '/collections/' + colNick;
                }
                else {
                    return website_base_url + '/collections/' + colNick + '/items/' + id;
                }
            };

            function split(str, separator, limit) {
                str = str.split(separator);

                if(str.length > limit) {
                    var ret = str.splice(0, limit);
                    ret.push(str.join(separator));

                    return ret;
                }

                return str;
            }
            return thumb;
    }]);


return thumbnails;
});