# UBC Library Open Collections - Discovery UI Component

This project is a fork of the discovery layer from UBC Library's Open Collections project. The search results and discovery component has been extracted for use in other projects. Templates have been modified to depend on vanilla bootstrap classes rather than UBC-CLF styles.


## Usage
clone into new repo

`npm install` to install build packages

`www/js/bower install` to install js dependencies

`grunt dev` to build dev files

see Gruntfile.js for watch/uat/prod actions


## Notes
This application is designed to interface with the Open Collections ElasticSearch API and data model.
Only data accessible through the OC Public API can be accessed through this standalone version of the UI. Some other required data sources have been shimmed to allow the app to function (ie. collection data service), but all UI elements may not function as expected (ie. save/export results).


## License
UBC Library Open Collections: A digital repository aggregator and discovery layer

Copyright (c) 2016 The University of British Columbia

License: GNU General Public License v3.0 (https://www.gnu.org/licenses/gpl-3.0.en.html)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

See http://www.gnu.org/licenses/ for full license.