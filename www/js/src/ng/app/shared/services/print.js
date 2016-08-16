define(function(require){

    var angular = require('angular');
    var services = require('services/services');
    
    /************** PRINT SERVICE *****************/
        // thank you Bahmni.org for making this available!
    services.factory('printer', [ '$rootScope', '$compile', '$http', '$timeout', 'utility', function ($rootScope, $compile, $http, $timeout, utility) {
        var printHtml = function (html) {
            var hiddenFrame = $('<iframe name="printframe" style=""></iframe>').appendTo('body')[ 0 ];
            
            var htmlContent = "<!doctype html>" +
            '<head><meta http-equiv="X-UA-Compatible" content="IE=edge"></head>' +
                "<html>" +
                '<body>' +
                html +
                '</body>' +
                "</html>";
            var doc = hiddenFrame.contentWindow.document.open("text/html", "replace");
            doc.write(htmlContent);
            doc.close();

            $(hiddenFrame).on("load",function(){
                 if (!hiddenFrame.contentDocument.execCommand('print', false, null)){
                    hiddenFrame.contentWindow.focus();
                    console.log(hiddenFrame.contentWindow);
                    hiddenFrame.contentWindow.print();
                }   
                window.setTimeout(function(){
                    $(hiddenFrame).remove();
                }, 500 );
            });

        };
        var openNewWindow = function (html) {
            var newWindow = window.open("printTest.html");
            newWindow.addEventListener('load', function () {
                $(newWindow.document.body).html(html);
            }, false);
        };
        var print = function (templateUrl, data) {
            // console.log('print()', templateUrl, data);
            $http.get(templateUrl).success(function (template) {
                var printScope = $rootScope.$new();
                angular.extend(printScope, data);
                var element = $compile($('<div>' + template + '</div>'))(printScope);
                var waitForRenderAndPrint = function () {
                    if ( printScope.$$phase || $http.pendingRequests.length ) {
                        $timeout(waitForRenderAndPrint);
                    } else {
                        // console.log(element.html())
                        printHtml(element.html());
                        printScope.$destroy();
                    }
                };
                waitForRenderAndPrint();
            });
        };
        return {
            print: print
        };
    } ]);
    
});


