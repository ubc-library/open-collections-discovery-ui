define(function (require) {
    // "use strict";
    var angular = require('angular');
    var ngAnimate = require('ngAnimate');
    var velocity = require('velocity');

    var animations = angular.module('dlAnimations', ['ngAnimate']);

    // velocity-based slide up/down animation

    animations.animation('.dl-ani-hide', function(){
        var open = function(element, className, done){
            console.log('open!', element);
            element.hide().velocity('slideDown', {duration: 200});
            return function(cancel) {
              if(cancel) {
                element.stop();
              }
            };
        };

        var closed = function(element, className, done){
            element.velocity('slideUp', {duration: 200
            });
            return function(cancel) {
              if(cancel) {
                element.stop();
              }
            };
        };

        return {
            beforeAddClass: closed,
            removeClass: open,
            enter: open,
            leave: closed
        };
    });

    // velocity.js based show more / show less animations for facets

    animations.animation('.dl-f-more', function(){
        var showAll = function(element, className, done){
            // console.log(className);
            if( className == 'showAll'){
                // console.log('show all!');

                var opt = element.parent().find('.dl-f-options');
                var realH = opt[0].scrollHeight;

                opt.velocity({ 'max-height' : realH }, { duration : 300});
            } else {
                done();
            }

        };

        var showLess = function(element, className, done){
             if( className == 'showAll'){

                var opt = element.parent().find('.dl-f-options');
                var realH = opt[0].scrollHeight;

                opt.velocity({ 'max-height' : 451 }, { duration : 300})
                    .velocity('scroll', { duration: 300, offset: -200 });
             } else {
                done();
            }
        };

        return {
            addClass: showAll,
            removeClass: showLess
        };
    });

    // velocity.js based show more / show less animations for SIDEBAR  ---> REMOVED TO JQUERY.

    return animations;
});
