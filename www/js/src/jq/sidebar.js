// Open Collections Sidebar jQuery Plugin 
// @schuyberg 2014

// Tickets: DL-126

// requires jQuery, VelocityJS, EnquireJS, HammerJS
//Hammer = require('hammer');

;(function($){

    $.fn.extend({
        sidebar: function(options,arg) {

            if (options && typeof(options) == 'object') {
                options = $.extend( {}, $.sidebar.defaults, options );
            } 
            // this creates a plugin for each element in
            // the selector or runs the function once per
            // selector.  To have it do so for just the
            // first element (once), return false after
            // creating the plugin to stop the each iteration 
            this.each(function() {
                new $.sidebar(this, options, arg );
            });
            return;
        }
    });

    $.sidebar = function(elem, options, arg){

        // console.log(elem, options, arg);

        // init vars

        var sSize = false,
            toggleBtn = $(elem).find(options.toggleBtn),
            sidebar = $(elem).find(options.sidebar),
            content = $(elem).find(options.content),
            container = $(elem),
            colWidth = 280,
            w = parseInt(sidebar.css('width').replace('px', ''));


        // catch method to toggle sidebar from outside the plugin

        if (options.toggle) {
            if(container.hasClass('sidebar-size')) { 
                sidebarToggle();
            }
            return;
        }    


        //respond to screen size changes

        // var break979 = "screen and (max-width: 979px)";
        // var break568 = "screen and (max-width: 568px)";
        var sidebarMax = "screen and (max-width: 680px)";
        // var initialHandler = {
        //         match : function() {
        //             // hideSidebar(0);
        //         },
        //         destroy : function(){
        //             console.log('initial handler destroyed');
        //         }
        //     };
        var ongoingHandler = {
                setup : function(){
                    // enquire.unregister(break979, initialHandler);
                    container.addClass('sidebar-in');
                },
                match : function() {
                    sSize = true;
                    sidebarUpdate();
                    swipeResponseOn();
                    container.addClass('sidebar-size');
                }, 

                unmatch : function () {
                    sSize = false;
                    sidebarUpdate();
                    swipeResponseOff();
                    container.removeClass('sidebar-size');
                }
            };

        // enquire.register(break979, initialHandler);
        enquire.register(sidebarMax, ongoingHandler);

        function sidebarUpdate() {
            if (container.hasClass('sidebar-in') && sSize === true) {

                hideSidebar(300);

            } else if (!sSize) {

                content.css('marginLeft','');
                sidebar.css('transform', 'translateX(0)');

            } 
        }

        // toggle button

        toggleBtn.on('click',function(){
            sidebarToggle();
        });

        function sidebarToggle() {

            // console.log(container.hasClass('sidebar-in'));

            if (container.hasClass('sidebar-in')){

                hideSidebar(300);

            } else if (!container.hasClass('sidebar-in')) {

                showSidebar(300);
            }

        }

        // swipe functionality (depends on hammerjs)
        
        var swipe;
        function swipeResponseOn(){
            swipe = new Hammer.Manager(document.getElementById('cols-wrap'), {
                recognizers: [

                    [ Hammer.Swipe, {direction: Hammer.DIRECTION_HORIZONTAL, velocity: 0.4} ]

                ]
            });

            swipe.on("swipeleft", function(){
                if(container.hasClass('sidebar-in')){
                    hideSidebar();
                }
            });
            swipe.on("swiperight", function(){
                if(!container.hasClass('sidebar-in')){
                    showSidebar();
                }
            });
        }
        function swipeResponseOff(){
            if(swipe){
                swipe.destroy();
            }
        }

        // show/hide functions

        function showSidebar(speed) {
            gaEvent('sidebar','show');
            sidebar.velocity({
                translateX: w - 10
            }, speed);
            content.velocity({
                marginLeft: w
                // translateX: w,
                // minWidth: colWidth - w - 10
            }, speed);

            // sidbar-in class effects children of container in css
            container.addClass('sidebar-in');
        }

        function hideSidebar(speed) {
            gaEvent('sidebar', 'hide');
            sidebar.velocity({
                translateX: 0
            }, speed);
            content.velocity({
                // translateX: (0),
                marginLeft: 10,
                // minWidth: 'auto'
            }, speed);

            // sidbar-in class effects children in css
            container.removeClass('sidebar-in');
            // sidebar.addClass('clickable');
        }

    };
    
    // default options
    $.sidebar.defaults = {
        sidebar : '#col-nav',
        content : '#col-results',
        toggleBtn : '#nav-toggle'
    };


    function gaEvent(category, action, label){
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
    }
}(jQuery));