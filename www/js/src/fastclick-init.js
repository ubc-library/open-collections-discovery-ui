// identify devices with screens smaller than an iPad to and load FastClick.js to remove 300ms click delay on touch devices
// this media query isn't foolproof, but it should get most phones and tablets and shouldn't hurt non-touch devices.
// Tickets: DL-126
require(['enquire'], function(enquire){
    var fastclickHandler = {
        match: function(){
            console.log('LOAD FASTCLICK');
            require(['fastclick'], function(FastClick){
                FastClick.attach(document.body);
            });
        }
    };

    enquire.register('only screen and (max-device-width: 1024px)', fastclickHandler);

});

