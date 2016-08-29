requirejs.config({
  "baseUrl" : "/js/build/",
  "waitSeconds": 0,
  "paths": {
        "advSearch": "ng/app/adv-search",
        "results": "ng/app/results",
        "facets": "ng/app/shared/facets/facets",
        "pagination": "ng/app/shared/pagination/pagination",
        "savedItems": "ng/app/shared/savedItems/savedItems",
        "filters": "ng/app/shared/filters",
        "animations": "ng/app/shared/animations",
        "services": "ng/app/shared/services",
        "d3directives": "ng/app/shared/d3directives/d3charts",
        "d3onebar": "ng/app/shared/d3directives/d3onebar",
        "d3datechart": "ng/app/shared/d3directives/d3datechart",
        "thumbnails": "ng/app/shared/thumbnails/thumbnails",
        "angular": "vendor/angular/angular.min",
        "ngAnimate": "vendor/angular-animate/angular-animate.min",
        "ngAria": "vendor/angular-aria/angular-aria.min",
        "ngCookies": "vendor/angular-cookies/angular-cookies.min",
        "ngResource": "vendor/angular-resource/angular-resource.min",
        "ngRoute": "vendor/angular-route/angular-route.min",
        "ngSanitize": "vendor/angular-sanitize/angular-sanitize.min",
        "ngTouch": "vendor/angular-touch/angular-touch.min",
        "ngModal": "vendor/angular-modal-service/dst/angular-modal-service.min",
        "ngCsv": "vendor/ng-csv/build/ng-csv.min",
        "d3": "vendor/d3/d3",
        "velocity": "vendor/velocity/velocity.min",
        "enquire": "vendor/enquire/dist/enquire.min",
        "hammer": "vendor/hammerjs/hammer",
        "fastclick": "vendor/fastclick/lib/fastclick",
        "jquery": "vendor/jquery/dist/jquery.min",
        "jqueryui": "vendor/jquery-ui/jquery-ui.min",
        "flipcards": "jq/flipcards",
        "moreless": "jq/moreless",
        "accordy": "jq/accordy",
        "sidebar": "jq/sidebar",
        "datepicker": "jq/datepicker",
        "pluginDetect": "pluginDetect",
        "fastclickInit": "fastclick-init",
        "hammerDefine": "require/window/hammer",
        "googlefont": "jq/googlefont",
        "licenses": "require/licenses"
    },
    "shim": {
        "angular": {
            "deps" : ["jquery"],
           "exports": "angular"
        },
        "ngAnimate": {
            "deps": ["angular"],
            "exports": "ngAnimate"
        },"ngAria": {
            "deps": ["angular"],
            "exports": "ngAria"
        },
        "ngCookies": {
            "deps": ["angular"],
            "exports": "ngCookies"
        },
        "ngModal": {
            "deps": ["angular"],
            "exports": "ngModal"
        },
        "ngResource": {
            "deps": ["angular"],
           "exports": "ngResource"
        },
        "ngRoute": {
            "deps": ["angular"],
            "exports": "ngRoute"
        },
        "ngSanitize": {
            "deps": ["angular"],
            "exports": "ngSanitize"
        },
        "ngTouch": {
            "deps": ["angular"],
            "exports": "ngTouch"
        },
        "ngCsv": {
            "deps": ["angular"],
            "exports": "ngCsv"
        },
        "d3": {
            "deps" : ["licenses/d3-license"],
            "exports": "d3"
        },
        "jquery": {
            "exports": "jquery"
        },
        "velocity": {
            "deps" : ["jquery"],
            "exports" : "velocity"
        },
        "jqueryui": {
            "deps": ["jquery"],
            "exports": "jqueryui"
        },
        "moreless": {
           "deps": [
                "jquery",
                "velocity"
            ],
            "exports": "moreless"
        },
        "sidebar": {
            "deps": [
                "jquery",
                "velocity",
                "enquire",
                "hammerDefine"
            ],
           "exports": "sidebar"
        },
        "hammerDefine": {
          "deps":["hammer"],
          "exports": "hammerDefine"
        },
        "viewer": {
            "deps": [
                "hammerDefine",
                "jqueryui",
                "velocity"
            ],
            "exports": "viewer"
        },
        "googlefont" : {
            "exports": "googlefont"
        }
    }
});
