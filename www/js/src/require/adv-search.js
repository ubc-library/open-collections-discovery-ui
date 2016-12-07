// Start the main app logic.
require(['advSearch', 'sidebar', 'fastclickInit'],
    function(resultsApp) {
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