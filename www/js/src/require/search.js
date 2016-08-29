// Start the main app logic.
require(['results/resultsApp', 'jquery', 'sidebar', 'fastclickInit'],
    function(resultsApp) {
        // enable sidebar
        $('#cols-wrap').sidebar({});  // include empty object to use default settings.

        // start angular app
        resultsApp.boot();

        // select all input on click (or not)
        $('#dl-srch-input').focus(function() { 
            var save_this = $(this);
            window.setTimeout (function(){ 
               save_this.select(); 
            },100);
        });
    }
);