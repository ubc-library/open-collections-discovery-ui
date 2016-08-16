// Saved Items Module

define(function (require) {

    var templatePath = js_base_url + "ng/app/shared/savedItems/templates/";

    // "use strict";
    var angular = require('angular'),
        ngCookies = require('ngCookies'),
        ngSanitize = require('ngSanitize'),
        ngCsv = require('ngCsv'),
        dlServices = require('services/collectionData'),
        dlServices = require('services/print'),
        angularModalService = require('ngModal'),
        dlFilters = require('filters');

    var savedItems = angular.module('dlSavedItems', [ 
        'dlServices', 
        'angularModalService', 
        'ngCookies', 
        'ngSanitize', 
        'ngCsv'
        ]);


    /************** SAVED ITEMS CONTROLLERS *****************/


    savedItems.controller('savedItemsCtrl', [ '$scope', 'ModalService', 'rExport', 'utility',
        function ($scope, modalService, rExport, utility) {


            $scope.savedCount = rExport.saved.length;

            $scope.$watch(function () {
                return rExport.saved.length;
            }, function (val) {
                if ( val !== $scope.savedCount ) {
                    $scope.savedCount = val;
                }
            });

            $scope.showSaved = function () {

                if ( $scope.display !== true ) {
                    // yeah yeah, no jquery inside a controller-shmoller..
                    $('body').addClass('dl-modal-open');
                    // ga event
                    utility.gaEvent('saved_items', 'show_saved_items', $scope.savedCount + ' items');

                    modalService.showModal({
                        templateUrl: templatePath + 'savedModal.html',
                        controller: "savedModalCtrl"
                    }).then(function (modal) {
                        modal.close.then(function () {
                            $('body').removeClass('dl-modal-open');
                        });
                    });
                }
            };

        } ])

        .controller('savedModalCtrl', [ '$scope', 'close', 'rExport', 'printer', '$http', 'utility',
            function ($scope, close, rExport, printer, $http, utility) {

                $scope.display = true;

                $scope.email = false;
                $scope.base_url = website_base_url;

                $scope.items = rExport.saved;

                $scope.toCsv = function () {
                    utility.gaEvent('saved_items', 'to_csv');

                    var csvData = [ [ 'TITLE', 'CREATOR', 'COLLECTION', 'DATE', 'TYPE', 'URL' ] ];

                    angular.forEach($scope.items, function (val, key) {

                        var data = [
                            "'" + val.title + "'",
                            "'" + val.creator + "'",
                            "'" + val.collection + "'",
                            "'" + val.sortDate + "'",
                            "'" + val.type + "'",
                            "'" + val.link_item + "'"
                        ];

                        csvData.push(data);

                        // var exportFields = []

                    });

                    return csvData;
                };

                $scope.toPrinter = function () {

                    utility.gaEvent('saved_items', 'to_printer');

                    
                    var template = templatePath + 'print-saved.html';
                    var data = {list: $scope.items};
                    console.log('to printer:', template, data);
                    
                    printer.print(template, data);
                };

                $scope.emailForm = function() {
                    $scope.email = true;
                };

                $scope.toEmail = function(eData) {
                    utility.gaEvent('saved_items', 'to_email');
                    
                    /* @JIRA DL-287 DL-285 */
                    var email = eData.email;

                    var items = $scope.items;

                    console.log(email, items);

                    return $http.post('/ajax/emailItemStash', {
                            email: email,
                            items: items
                        }
                    ).
                        success(function(data) {
                            $scope.emailSuccess = true;
                            $scope.email = false;
                            eData.email = '';
                            console.log('Stash sent via email..');
                        }).
                        error(function(data) {
                            console.log('Error sending stash via email');
                        });
                };

                $scope.$watch(function () {
                    return rExport.saved;
                }, function (val) {
                    if ( val !== $scope.items ) {
                        $scope.items = val;
                    }
                });

                console.log($scope.items, rExport.saved);

                $scope.saveResult = function (r) {

                    $scope.saved = rExport.save(r);

                };

                $scope.close = function (r) {
                    $scope.display = false;
                    close(r);
                };

                $scope.clearSaved = function () {
                    rExport.clear();
                };

                $scope.warning = rExport.warning;

                $scope.closeWarning = function () {
                    rExport.warning = false;
                    $scope.warning = false;

                };
                $scope.closeEmailSuccess = function () {
                    $scope.emailSuccess = false;

                };

            } ])


    /************** SAVED ITEMS DIRECTIVES *****************/

        .directive('savedFolder', [ function () {
            function link (scope, element, attrs) {

                // link stuff

            }

            return {
                controller: 'savedItemsCtrl',
                restrict: 'EA',
                scope: '=',
                templateUrl: templatePath + 'saved-folder.html',
                link: link
            };
        } ])


    /************** SAVED ITEMS SERVICE *****************/

        .factory('rExport', [ '$cookieStore', '$http', 'collectionData', '$filter', 'utility',
            function ($cookieStore, $http, collectionData, $filter, utility) {

                var rExport = {};

                rExport.warning = true;

                rExport.saved = $cookieStore.get('savedItems') || [];

                rExport.isSaved = function (_id) {
                    var verdict = false;
                    angular.forEach(rExport.saved, function (val, key) {
                        if ( val._id === _id ) {
                            verdict = true;
                        }
                    });
                    return verdict;
                };

                rExport.save = function (r) {

                    // console.log(r);

                    var bool;

                    if ( rExport.isSaved(r._id) ) {

                        utility.gaEvent('saved_items', 'remove_item');

                        rExport.saved = rExport.saved.filter(function (e) {
                            return e._id !== r._id;
                        });

                        $http.defaults.headers.common[ "X-Requested-With" ] = 'XMLHttpRequest';
                        $http.post('/search/unstash', {
                                id: r._id
                            }
                        ).
                            success(function (data, status, headers, config) {
                                console.log(data);
                                console.log('reload page and see if item is in cookie!');
                            }).
                            error(function (data, status, headers, config) {
                                console.log('failed');
                            });

                        // console.log('item removed', rExport.saved);

                        bool = false;

                    } else {

                        utility.gaEvent('saved_items', 'save_item');

                        var saveR = {
                            _id: r._id,
                            handle: r.handle,
                            nick: r.nick,
                            collection: $filter('stripHtmlTags')(r.collection),
                            creator: $filter('stripHtmlTags')(r.creator),
                            sortDate: $filter('stripHtmlTags')(r.sortDate),
                            saved: true,
                            title: $filter('stripHtmlTags')(r.title),
                            type: r.type,
                            link_item : website_base_url + '/' +r.itemLink,
                            link_collection : website_base_url + '/' + r.collectionLink,
                            repo: r.repo
                        };

                        rExport.saved.push(saveR);

                        bool = true;
                        $http.defaults.headers.common[ "X-Requested-With" ] = 'XMLHttpRequest';
                        $http.post('/search/stash', {
                                readings: saveR
                            }
                        ).
                            success(function (data, status, headers, config) {
                                console.log('reload page and see if item is in cookie!');
                            }).
                            error(function (data, status, headers, config) {
                                console.log('failed');
                            });
                        $cookieStore.put('savedItems', rExport.saved);
                        r.saved = true;
                        return bool;

                    }
                };

                rExport.clear = function () {
                    utility.gaEvent('saved_items', 'clear_saved');
                    rExport.saved = [];
                    $http.defaults.headers.common[ "X-Requested-With" ] = 'XMLHttpRequest';
                    $http.post('/search/unstash', {
                            id: '_all'
                        }
                    ).
                        success(function (data, status, headers, config) {
                            console.log(data);
                            console.log('reload page and see if item is in cookie!');
                        }).
                        error(function (data, status, headers, config) {
                            console.log('failed');
                        });
                    $cookieStore.put('savedItems', rExport.saved);
                };

                return rExport;

            } ]);

    return savedItems;
});


