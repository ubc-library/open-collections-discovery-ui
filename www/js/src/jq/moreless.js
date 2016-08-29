define(["jquery"],
    function($){
    $.fn.moreLess = function(options){

        var opts = $.extend({

            activator   : '.dl-f-activator',
            target      : '.dl-f-options'

        }, options);

        return this.each(function(){

            var act = $(this).find(opts.activator),
                t = $(this).find(opts.target);

            t.animate('slideUp', {duration: 0});

            act.on('click', function() {

                console.log('MORELESS');

                if(t.hasClass('hidden')){
                    unhide(t);
                    t.animate('slideDown', {duration: 300});
                    pointDown(act.children('i'));
                } else if(!t.hasClass('hidden')){
                    pointRight(act.children('i'));
                    t.animate('slideUp', {duration: 300,
                        complete: function(){hide(t);}
                    });
                }
            });
        });
    };

    // 'accordy' : custom jquery accordion (for facets). 
    // --- possibly deprecated: using Angular instead.

    $.fn.accordy = function(options){

        var opts = $.extend({

            parentGroup : '.dl-facets',
            activator   : '.dl-f-activator',
            target      : '.dl-f-options'

        }, options);

        //p is parent group, a activates, t is target(s)
        return this.each(function(){
            var act = $(this).find(opts.activator);
            // console.log(act);
            var tgts = $(this).find(opts.target);
            // console.log(tgts);
            // var pH = $(p).height();

            // console.log(pH);

            // noClickE(act);

            act.on('click', act, function(e) {
                e.preventDefault();
                var link = this;
                var visible = $(opts.target).not('.hidden');
                var thisT =  $(this).parents(opts.parentGroup).find(tgts);
                if (thisT.hasClass('hidden')) {
                        $(visible).animate('slideUp', {
                            duration: 300,
                            complete: function(){hide(visible)}
                        });
                        unhide(thisT);
                        $(thisT).animate('slideUp', {duration: 0});
                        $(thisT).animate('slideDown', {duration: 300});
                        
                        // stop();
                        pointRight($(opts.parentGroup).find('i'));
                        pointDown($(this).children('i'));
                    // });
                } else if (!thisT.hasClass('hidden')){
                    // hide(thisT);
                    $(thisT).animate('slideUp', {
                        duration: 300,
                        complete: function(){hide(thisT)}
                    });
                    pointRight($(this).children('i'));
                }
            });

        });

    }

    $.fn.simpleSlide = function(btn){

        var el = $(this),
            button = $(btn);

        bindButton();
        // el.animate('slideUp', {duration:0});

        function bindButton(){
            // bind button click event
            button.on('click',function(event){
                // hide element
                unhide(el);
                el.velocity('slideUp', {duration:0});
                el.velocity('slideDown', {duration:100});

                // unbind button click event for now
                $(this).unbind(event);
                //wait a millisec or two so clicks don't conflict
                setTimeout(function(){
                    // bind window click event
                    button.on('click', function(event){
                        // check for click outside element
                        if(!$(event.target).parents().addBack().is(el)){
                            // hide element
                            el.velocity('slideUp', {duration: 100,
                                complete: function(){
                                    hide(el)
                                    // unbind window click event
                                    $(this).unbind(event);
                                    // (re)bind button click event
                                    bindButton();
                                }
                            });
                        }
                    });
                }, 2);
            });
        }
        
    }

    // SHARED FUNCTIONS
    function pointRight(t){
        t.removeClass('fa fa-angle-down')
            .addClass('fa fa-angle-right');
    }

    function pointDown(t){
        t.removeClass('fa fa-angle-right')
                .addClass('fa fa-angle-down');
    }

    function unhide(o){
            o.removeClass('hidden');
    }
    
    function hide(o){
        o.addClass('hidden');
    }

});