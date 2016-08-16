# driad-discovery-ui : UBC Library Open Collections - Discovery UI Component

This project is a fork of the discovery layer from UBC Library's Open Collections project. The search results and discovery component has been extracted for potential use in other projects. Templates have been modified to depend on vanilla bootstrap classes rather than UBC-CLF styles.

This application is designed to interface with the Open Collections ElasticSearch API and data model. Significant modifications may be necessary to connect to alternative data sources at this time.

## Usage
clone into new repo

`npm install` to install build packages

`www/js/bower install` to install js dependencies

`grunt dev` to build dev files

see Gruntfile.js for watch/uat/prod actions


## Notes
Note that only data accessible through the OC Public APIs can be accessed through this standalone version of the UI. Some other required data sources have been shimmed to allow the app to function (ie. collection data service), but not all UI elements will function as expected (ie. save/export results).
