/************** COLLECTION DATA SERVICE *****************/

// TICKETS: DL-477

 define(function(require){

    var angular = require('angular');
    var services = require('services/services');


        // load data
    services.factory('collectionData', [ '$q', '$http', '$filter', 
        function ($q, $http, $filter) {
            "use strict";
            var d = {};

            // console.log('BASE',website_base_url);
            // These functions are used to load data for the admin pages.
            // current collection id (for editing / reloading reference)
            d.currentCol = '';
            // http getters

            var getColsData = function(){
                return $http({
                    method: 'GET',
                    url   : website_base_url + '/ajax/get_collections_and_aggregates'
                }).success(function (data) {
                    return data;
                }).error(function (error) {
                    // return console.log('ERROR:'), error;
                });
            };

            var getAdminColsData = function(){
                return $http({
                    method: 'GET',
                    url   : website_base_url + '/ajax/get_admin_collections_and_aggregates'
                }).success(function (data) {
                    return data;
                }).error(function (error) {
                    // return console.log('ERROR:'), error;
                });
            };

            var makeColsList = function(input, opt){
                var colsList =[];
                angular.forEach(input, function(val, key){
                    if(val.visible === 1 && val.searchable === 1) { 
                        colsList.push(val);
                    } else {
                        // console.log(val);
                    }
                });
                colsList = $filter('orderObjectBy')(colsList, 'title');
                return colsList;
            };

            var makeColsListAdmin = function(input, opt){
                var colsList =[];
                angular.forEach(input, function(val, key){
                    if(val.visible === 1) {
                        colsList.push(val);
                    } else {
                        // console.log(val);
                    }
                });
                colsList = $filter('orderObjectBy')(colsList, 'title');
                return colsList;
            };
                
            var getTopicsData = function() {
                return $http({
                    method: 'GET',
                    url   : website_base_url + '/ajax/get_topics'
                }).success(function (data) {
                    return data;
                }).error(function (error) {
                    // console.log('ERROR:', error);
                });
            };

            var getCircleCatsData = function(){
                return $http({
                    method: 'GET',
                    url   : website_base_url + '/ajax/get_categories'
                }).success(function (data) {
                    return data;
                }).error(function (error) {
                    console.log('ERROR:', error);
                });
            };

            var getColData = function(colID){
                return $http({
                    method: 'GET',
                    url   : website_base_url + '/ajax/get_collection_or_aggregate/' + colID

                }).success(function (data) {
                    return data;
                }).error(function (error) {
                    console.log('ERROR:', error);
                });
            };


            var save = function(newData){

                return $http.post('/admin/save', {
                        data: newData
                    }
                ).
                    success(function(response) {
                        console.log('save success', response);
                    }).
                    error(function(error) {
                        console.log('save error', error);
                });
            };

            // get collection titles from DB, but save current list in service for quick use.
            // --> grabs collection titles and saves them in 'colTitles' - will request additonal from DB if not found there
            // return a promise either way.
            


            // HANDLE COLLECTION & AGGREGATE TITLES / NICK MAPPINGS
            // these functions are used in the main search app and collection level pages.
            // DATA FOR colTitles and colsAndAggsData are shimmed here to keep the UI working. recent changes to the oc-db won't be reflected.
            var colTitles = {
                "24": {
                    "nick": "ubctheses",
                    "title": "UBC Theses and Dissertations"
                },
                "298": {
                    "nick": "298",
                    "title": "Microstructure Engineering",
                    "viz": 1
                },
                "304": {
                    "nick": "304",
                    "title": "CHER Research Papers",
                    "viz": 1
                },
                "310": {
                    "nick": "310",
                    "title": "SCARP Graduating Projects",
                    "viz": 1
                },
                "340": {
                    "nick": "340",
                    "title": "Seismic Laboratory for Imaging and Modeling",
                    "viz": 1
                },
                "441": {
                    "nick": "441",
                    "title": "UBC Press Catalogues",
                    "viz": 1
                },
                "494": {
                    "nick": "494",
                    "title": "Library Staff Papers and Presentations",
                    "viz": 1
                },
                "536": {
                    "nick": "536",
                    "title": "Multidisciplinary Undergraduate Research Conference (MURC), 2008",
                    "viz": 1
                },
                "538": {
                    "nick": "538",
                    "title": "Physics Podcasts",
                    "viz": 1
                },
                "547": {
                    "nick": "547",
                    "title": "Physics & Astronomy Undergraduate Honours Theses",
                    "viz": 1
                },
                "594": {
                    "nick": "594",
                    "title": "Scientia Silvica Extension Series ",
                    "viz": 1
                },
                "641": {
                    "nick": "641",
                    "title": "UBC Press Book Supplements",
                    "viz": 1
                },
                "801": {
                    "nick": "801",
                    "title": "Vogt Symposium",
                    "viz": 1
                },
                "831": {
                    "nick": "ubctheses",
                    "title": "UBC Theses and Dissertations"
                },
                "858": {
                    "nick": "858",
                    "title": "SLAIS Faculty",
                    "viz": 1
                },
                "947": {
                    "nick": "947",
                    "title": "Fisheries Centre Reports [Annual]",
                    "viz": 1
                },
                "948": {
                    "nick": "948",
                    "title": "CHER Theses and Dissertations",
                    "viz": 1
                },
                "990": {
                    "nick": "990",
                    "title": "Metropolis BC Policy Research Symposium, May 15, 2008",
                    "viz": 1
                },
                "1022": {
                    "nick": "1022",
                    "title": "6th International Conference on Gas Hydrates",
                    "viz": 1
                },
                "1037": {
                    "nick": "1037",
                    "title": "FRST 497",
                    "viz": 1
                },
                "1038": {
                    "nick": "1038",
                    "title": "FRST 499",
                    "viz": 1
                },
                "1039": {
                    "nick": "1039",
                    "title": "FRST 498",
                    "viz": 1
                },
                "1041": {
                    "nick": "1041",
                    "title": "CONS 498",
                    "viz": 1
                },
                "1042": {
                    "nick": "1042",
                    "title": "WOOD 493",
                    "viz": 1
                },
                "1077": {
                    "nick": "1077",
                    "title": "frontier, issue 4, June 2008",
                    "viz": 1
                },
                "1078": {
                    "nick": "1078",
                    "title": "Earth, Ocean and Atmospheric Sciences Undergraduate Honours Theses",
                    "viz": 1
                },
                "1151": {
                    "nick": "1151",
                    "title": "Skylight Publications and Reports",
                    "viz": 1
                },
                "1309": {
                    "nick": "1309",
                    "title": "frontier, issue 3, November 2007",
                    "viz": 1
                },
                "1312": {
                    "nick": "1312",
                    "title": "frontier, issue 2, December 2006",
                    "viz": 1
                },
                "1314": {
                    "nick": "1314",
                    "title": "frontier, issue 1, May 2006",
                    "viz": 1
                },
                "1423": {
                    "nick": "1423",
                    "title": "SCARP Faculty Research and Publications",
                    "viz": 1
                },
                "1426": {
                    "nick": "1426",
                    "title": "SCARP Course Projects",
                    "viz": 1
                },
                "2689": {
                    "nick": "2689",
                    "title": "Library Events",
                    "viz": 1
                },
                "2753": {
                    "nick": "2753",
                    "title": "frontier, issue 5, Fall/Winter 2008",
                    "viz": 1
                },
                "2754": {
                    "nick": "2754",
                    "title": "Library  Teaching Tools",
                    "viz": 1
                },
                "2765": {
                    "nick": "2765",
                    "title": "Midwifery Graduating Essays",
                    "viz": 1
                },
                "4189": {
                    "nick": "4189",
                    "title": "Congress 2008",
                    "viz": 1
                },
                "4915": {
                    "nick": "4915",
                    "title": "SLC 2009",
                    "viz": 1
                },
                "5744": {
                    "nick": "5744",
                    "title": "Multidisciplinary Undergraduate Research Conference (MURC), 2009",
                    "viz": 1
                },
                "6928": {
                    "nick": "6928",
                    "title": "Science One Research Projects 2008-2009",
                    "viz": 1
                },
                "6936": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "6944": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "7298": {
                    "nick": "7298",
                    "title": "Occupational Therapy Presentations",
                    "viz": 1
                },
                "7410": {
                    "nick": "7410",
                    "title": "Engineering Physics Projects",
                    "viz": 1
                },
                "7473": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "7474": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "7476": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "7897": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "7898": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "7899": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "7900": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "7977": {
                    "nick": "7977",
                    "title": "History Honours Essays",
                    "viz": 1
                },
                "8073": {
                    "nick": "8073",
                    "title": "SCARP Independent Work",
                    "viz": 1
                },
                "8074": {
                    "nick": "8074",
                    "title": "APS Northwest Section 11th Annual Meeting",
                    "viz": 1
                },
                "8689": {
                    "nick": "8689",
                    "title": "Presentations, VP Students Office",
                    "viz": 1
                },
                "8833": {
                    "nick": "8833",
                    "title": "CIHR Research Outputs 2008"
                },
                "8865": {
                    "nick": "8865",
                    "title": "Computer Science Faculty Publications and Reports",
                    "viz": 1
                },
                "8930": {
                    "nick": "8930",
                    "title": "frontier, issue 6, Spring/Summer 2009",
                    "viz": 1
                },
                "9096": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "9098": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "9371": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "9372": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "9373": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "9374": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "9376": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "9377": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "9378": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "9379": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "9420": {
                    "nick": "9420",
                    "title": "English Faculty Publications",
                    "viz": 1
                },
                "11119": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "11122": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "11123": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "11124": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "11125": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "11126": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "11128": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "11135": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "11233": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "11237": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "11241": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "11242": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "11243": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "11568": {
                    "nick": "11568",
                    "title": "Asian Library: Articles/Publications",
                    "viz": 1
                },
                "11569": {
                    "nick": "11569",
                    "title": "Asian Library: Audiovisual Records",
                    "viz": 1
                },
                "11570": {
                    "nick": "11570",
                    "title": "Asian Library: News Articles",
                    "viz": 1
                },
                "11571": {
                    "nick": "11571",
                    "title": "Asian Library: Miscellaneous",
                    "viz": 1
                },
                "12547": {
                    "nick": "12547",
                    "title": "CIHR Research Outputs 2009"
                },
                "12674": {
                    "nick": "12674",
                    "title": "MPT Systematic Reviews and Research Projects",
                    "viz": 1
                },
                "12708": {
                    "nick": "12708",
                    "title": "Vancouver Institute Lectures",
                    "viz": 1
                },
                "13138": {
                    "nick": "13138",
                    "title": "Politics, Memory, and Dissent: May Fourth, June Fourth & Beyond",
                    "viz": 1
                },
                "13139": {
                    "nick": "13139",
                    "title": "Annual Forestry Lecture in Sustainability",
                    "viz": 1
                },
                "13706": {
                    "nick": "13706",
                    "title": "GEOG 362: Geography of Economic Development",
                    "viz": 1
                },
                "13806": {
                    "nick": "13806",
                    "title": "NEXUS Spring Institute",
                    "viz": 1
                },
                "13807": {
                    "nick": "13807",
                    "title": "NEXUS Seminar Series",
                    "viz": 1
                },
                "13808": {
                    "nick": "13808",
                    "title": "NEXUS Portal Newsletters",
                    "viz": 1
                },
                "13809": {
                    "nick": "13809",
                    "title": "NEXUS Annual Reports",
                    "viz": 1
                },
                "13810": {
                    "nick": "13810",
                    "title": "NEXUS Other Knowledge Exchange",
                    "viz": 1
                },
                "13917": {
                    "nick": "13917",
                    "title": "Science Interdisciplinary Coursework",
                    "viz": 1
                },
                "13918": {
                    "nick": "13918",
                    "title": "Arts Interdisciplinary Coursework",
                    "viz": 1
                },
                "14850": {
                    "nick": "14850",
                    "title": "frontier, issue 7, Fall/Winter 2009",
                    "viz": 1
                },
                "14857": {
                    "nick": "14857",
                    "title": "Civil Engineering Faculty Publications",
                    "viz": 1
                },
                "15810": {
                    "nick": "15810",
                    "title": "Social Work Student Major Papers",
                    "viz": 1
                },
                "16648": {
                    "nick": "16648",
                    "title": "St. Mark's College Major Research Papers",
                    "viz": 1
                },
                "17990": {
                    "nick": "17990",
                    "title": "Asian Studies Undergraduate Papers",
                    "viz": 1
                },
                "18828": {
                    "nick": "18828",
                    "title": "Anthropology Faculty Research",
                    "viz": 1
                },
                "18836": {
                    "nick": "18836",
                    "title": "Cedar Mesa Project",
                    "viz": 1
                },
                "18861": {
                    "nick": "18861",
                    "title": "UBC Social Ecological Economic Development Studies (SEEDS) Student Reports",
                    "viz": 1
                },
                "19749": {
                    "nick": "19749",
                    "title": "Mathematics Faculty Publications and Reports",
                    "viz": 1
                },
                "20212": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "21391": {
                    "nick": "21391",
                    "title": "Beyond the Centre: Newsletters of the CWGS",
                    "viz": 1
                },
                "21541": {
                    "nick": "21541",
                    "title": "UBC Press Publications",
                    "viz": 1
                },
                "21743": {
                    "nick": "21743",
                    "title": "Multidisciplinary Undergraduate Research Conference (MURC), 2010",
                    "viz": 1
                },
                "21986": {
                    "nick": "21986",
                    "title": "Asian Edge",
                    "viz": 1
                },
                "23302": {
                    "nick": "23302",
                    "title": "Library Assessment: Statistics",
                    "viz": 1
                },
                "23303": {
                    "nick": "23303",
                    "title": "Library Assessment: Publications/Presentations",
                    "viz": 1
                },
                "23304": {
                    "nick": "23304",
                    "title": "Library Assessment: LibQUAL Surveys",
                    "viz": 1
                },
                "23326": {
                    "nick": "23326",
                    "title": "Electrical and Computer Engineering Undergraduate Thesis",
                    "viz": 1
                },
                "23361": {
                    "nick": "23361",
                    "title": "Book Reviews: Asia General",
                    "viz": 1
                },
                "23362": {
                    "nick": "23362",
                    "title": "Book Reviews: China and Inner Asia",
                    "viz": 1
                },
                "23363": {
                    "nick": "23363",
                    "title": "Book Reviews: Northeast Asia",
                    "viz": 1
                },
                "23364": {
                    "nick": "23364",
                    "title": "Book Reviews: South Asia",
                    "viz": 1
                },
                "23365": {
                    "nick": "23365",
                    "title": "Book Reviews: Southeast Asia",
                    "viz": 1
                },
                "23366": {
                    "nick": "23366",
                    "title": "Book Reviews: Australasia and the Pacific Region",
                    "viz": 1
                },
                "23509": {
                    "nick": "23509",
                    "title": "ASTU400J: Knowledge and Power in International Relations",
                    "viz": 1
                },
                "23514": {
                    "nick": "23514",
                    "title": "CWGS Students",
                    "viz": 1
                },
                "23553": {
                    "nick": "23553",
                    "title": "Library Research Reports",
                    "viz": 1
                },
                "24062": {
                    "nick": "24062",
                    "title": "BCRLG Lecture Series",
                    "viz": 1
                },
                "24465": {
                    "nick": "24465",
                    "title": "Environmental Science Undergraduate Research Papers and Reports",
                    "viz": 1
                },
                "24571": {
                    "nick": "24571",
                    "title": "Science One Research Projects 2009-2010",
                    "viz": 1
                },
                "24886": {
                    "nick": "24886",
                    "title": "Nursing Students Major Essays and Projects",
                    "viz": 1
                },
                "24887": {
                    "nick": "24887",
                    "title": "Nursing Faculty Publications and Reports",
                    "viz": 1
                },
                "25332": {
                    "nick": "25332",
                    "title": "UBC Authors and Their Works Program, 1991-2006",
                    "viz": 1
                },
                "25805": {
                    "nick": "25805",
                    "title": "Speeches & Writing by UBC President Stephen J. Toope",
                    "viz": 1
                },
                "26494": {
                    "nick": "26494",
                    "title": "Faculty Development Publications (Medicine)",
                    "viz": 1
                },
                "26566": {
                    "nick": "26566",
                    "title": "CIHR Research Outputs 2010"
                },
                "26856": {
                    "nick": "26856",
                    "title": "CWGS Lecture Series: Podcasts and Notes",
                    "viz": 1
                },
                "26857": {
                    "nick": "26857",
                    "title": "CWGS Graduate Student Conference: podcasts",
                    "viz": 1
                },
                "26876": {
                    "nick": "26876",
                    "title": "Software Engineering Technical Reports",
                    "viz": 1
                },
                "26952": {
                    "nick": "26952",
                    "title": "Electrical Engineering Faculty Research",
                    "viz": 1
                },
                "26989": {
                    "nick": "26989",
                    "title": "School of Engineering Faculty Publications (Okanagan Campus)",
                    "viz": 1
                },
                "27306": {
                    "nick": "27306",
                    "title": "Irving K. Barber Learning Centre Events",
                    "viz": 1
                },
                "29050": {
                    "nick": "29050",
                    "title": "Anthropology Honours Theses (LoA)",
                    "viz": 1
                },
                "29055": {
                    "nick": "29055",
                    "title": "10th Canadian Summer School on Quantum Information",
                    "viz": 1
                },
                "29912": {
                    "nick": "29912",
                    "title": "Xwi7xwa Library: Publications",
                    "viz": 1
                },
                "29962": {
                    "nick": "29962",
                    "title": "Xwi7xwa Library: Indigenous Librarianship / Indigenous Knowledge Organization",
                    "viz": 1
                },
                "29986": {
                    "nick": "29986",
                    "title": "Workshop on Quantum Algorithms, Computational Models and Foundations of Quantum Mechanics",
                    "viz": 1
                },
                "30115": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "30410": {
                    "nick": "30410",
                    "title": "Museum of Anthropology (MOA) Staff and Faculty Research",
                    "viz": 1
                },
                "31775": {
                    "nick": "31775",
                    "title": "UBC Historical Sound and Moving Image Collection",
                    "viz": 1
                },
                "31776": {
                    "nick": "31776",
                    "title": "UBC Faculty Publications Lists (1928-1969)",
                    "viz": 1
                },
                "32457": {
                    "nick": "32457",
                    "title": "SLAIS Research Days",
                    "viz": 1
                },
                "32536": {
                    "nick": "32536",
                    "title": "Atmospheric Science Program",
                    "viz": 1
                },
                "32618": {
                    "nick": "32618",
                    "title": "Xwi7xwa Library: Aboriginal Education",
                    "viz": 1
                },
                "33066": {
                    "nick": "33066",
                    "title": "Perspectives Newspaper",
                    "viz": 1
                },
                "33067": {
                    "nick": "33067",
                    "title": "Chinese Canadian Stories media",
                    "viz": 1
                },
                "33359": {
                    "nick": "33359",
                    "title": "Faculty of Medicine: General Faculty Papers",
                    "viz": 1
                },
                "33381": {
                    "nick": "33381",
                    "title": "cIRcle License Text",
                    "viz": 1
                },
                "33426": {
                    "nick": "33426",
                    "title": "Supplementary Thesis Materials and Errata",
                    "viz": 1
                },
                "33755": {
                    "nick": "33755",
                    "title": "UBC Law Special Lectures",
                    "viz": 1
                },
                "33850": {
                    "nick": "33850",
                    "title": "Award: UBC Library Innovative Dissemination of Research Award",
                    "viz": 1
                },
                "34125": {
                    "nick": "34125",
                    "title": "GEOG 419: Research in Environmental Geography",
                    "viz": 1
                },
                "34295": {
                    "nick": "34295",
                    "title": "Explorations and Education",
                    "viz": 1
                },
                "34788": {
                    "nick": "34788",
                    "title": "Science One Research Projects 2010-2011",
                    "viz": 1
                },
                "34910": {
                    "nick": "34910",
                    "title": "SPIE Publications (Electrical and Computer Engineering)",
                    "viz": 1
                },
                "35034": {
                    "nick": "35034",
                    "title": "Frontotemporal Dementia (FTD) Research Group Papers",
                    "viz": 1
                },
                "35080": {
                    "nick": "35080",
                    "title": "Investigating Our Practices",
                    "viz": 1
                },
                "35980": {
                    "nick": "35980",
                    "title": "SLAIS Students",
                    "viz": 1
                },
                "36347": {
                    "nick": "36347",
                    "title": "History Faculty Research",
                    "viz": 1
                },
                "36392": {
                    "nick": "36392",
                    "title": "Forestry Faculty Publications",
                    "viz": 1
                },
                "36393": {
                    "nick": "36393",
                    "title": "Forestry Annual Reports",
                    "viz": 1
                },
                "36394": {
                    "nick": "36394",
                    "title": "Branchlines",
                    "viz": 1
                },
                "36467": {
                    "nick": "36467",
                    "title": "EDST Student Graduating Papers",
                    "viz": 1
                },
                "36877": {
                    "nick": "36877",
                    "title": "EDCP Home Economics: Human Ecology and Everyday Life (HEEL)",
                    "viz": 1
                },
                "36883": {
                    "nick": "36883",
                    "title": "SPIE Publications (Physics &  Astronomy)",
                    "viz": 1
                },
                "37052": {
                    "nick": "37052",
                    "title": "Fisheries Centre Research Reports",
                    "viz": 1
                },
                "37211": {
                    "nick": "37211",
                    "title": "Tailings and Mine Waste 2011: Vancouver, Canada",
                    "viz": 1
                },
                "37212": {
                    "nick": "37212",
                    "title": "Earth, Ocean and Atmospheric Sciences Faculty Research",
                    "viz": 1
                },
                "37859": {
                    "nick": "37859",
                    "title": "SBE Division Teaching Notes",
                    "viz": 1
                },
                "37865": {
                    "nick": "37865",
                    "title": "SBE Division Working Papers",
                    "viz": 1
                },
                "38108": {
                    "nick": "38108",
                    "title": "Mazatan Project, Chiapas, Mexico",
                    "viz": 1
                },
                "38316": {
                    "nick": "38316",
                    "title": "Analytical Geochemistry",
                    "viz": 1
                },
                "38318": {
                    "nick": "38318",
                    "title": "High-temperature Geochemistry",
                    "viz": 1
                },
                "38319": {
                    "nick": "38319",
                    "title": "Low-temperature Geochemistry",
                    "viz": 1
                },
                "38422": {
                    "nick": "38422",
                    "title": "Mechanical Engineering Faculty Publications",
                    "viz": 1
                },
                "39137": {
                    "nick": "39137",
                    "title": "MAAPPS Practicum Reports",
                    "viz": 1
                },
                "39339": {
                    "nick": "39339",
                    "title": "Philosophy Faculty Research",
                    "viz": 1
                },
                "39440": {
                    "nick": "39440",
                    "title": "Green College Webcasts",
                    "viz": 1
                },
                "39478": {
                    "nick": "39478",
                    "title": "Asian Studies Faculty Research",
                    "viz": 1
                },
                "40947": {
                    "nick": "40947",
                    "title": "Graduate Law Students' Conference Publications",
                    "viz": 1
                },
                "41082": {
                    "nick": "41082",
                    "title": "Science One Research Projects 2011-2012",
                    "viz": 1
                },
                "41119": {
                    "nick": "41119",
                    "title": "Sea Around Us Project Newsletter",
                    "viz": 1
                },
                "41223": {
                    "nick": "41223",
                    "title": "EDST Special Lectures & Faculty Publications",
                    "viz": 1
                },
                "41228": {
                    "nick": "41228",
                    "title": "Public Health, Emerging Threats & Rapid Response",
                    "viz": 1
                },
                "41328": {
                    "nick": "41328",
                    "title": "Fraser Valley Archaeological Project, BC, Canada",
                    "viz": 1
                },
                "41792": {
                    "nick": "41792",
                    "title": "UBC Nursing Student Journal (UBC-NSJ), 2012",
                    "viz": 1
                },
                "41904": {
                    "nick": "41904",
                    "title": "CIHR Research Outputs 2011+"
                },
                "41978": {
                    "nick": "41978",
                    "title": "Remote Sensing Methods",
                    "viz": 1
                },
                "42020": {
                    "nick": "42020",
                    "title": "RBSC:  Audiovisual Records",
                    "viz": 1
                },
                "42036": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "42387": {
                    "nick": "42387",
                    "title": "Geography Faculty Publications and Reports",
                    "viz": 1
                },
                "42446": {
                    "nick": "42446",
                    "title": "Multidisciplinary Undergraduate Research Conference (MURC), 2012+",
                    "viz": 1
                },
                "42486": {
                    "nick": "42486",
                    "title": "English Undergraduate Honours Essays (Okanagan Campus)",
                    "viz": 1
                },
                "42487": {
                    "nick": "42487",
                    "title": "Master of Science in Nursing (MSN) Scholarly Projects (Okanagan Campus)",
                    "viz": 1
                },
                "42488": {
                    "nick": "42488",
                    "title": "School of Nursing Faculty Publications (Okanagan Campus)",
                    "viz": 1
                },
                "42493": {
                    "nick": "42493",
                    "title": "Chemistry Undergraduate Honours Essays (Okanagan Campus)",
                    "viz": 1
                },
                "42494": {
                    "nick": "42494",
                    "title": "History Undergraduate Honours Theses, Projects, Essays (Okanagan Campus)",
                    "viz": 1
                },
                "42495": {
                    "nick": "42495",
                    "title": "Undergraduate Student Course Work, IKBSAS (Okanagan Campus)",
                    "viz": 1
                },
                "42496": {
                    "nick": "42496",
                    "title": "Psychology Undergraduate Honours Essays (Okanagan Campus)",
                    "viz": 1
                },
                "42497": {
                    "nick": "42497",
                    "title": "Computer Science Undergraduate Honours Essays (Okanagan Campus)",
                    "viz": 1
                },
                "42543": {
                    "nick": "42543",
                    "title": "Biology Program",
                    "viz": 1
                },
                "42591": {
                    "nick": "42591",
                    "title": "GSS cIRcle Open Scholar Award (UBCV Non-Thesis Graduate Work)",
                    "viz": 1
                },
                "43342": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "43377": {
                    "nick": "43377",
                    "title": "UBC Japanese Canadian Students of 1942",
                    "viz": 1
                },
                "43391": {
                    "nick": "43391",
                    "title": "WCILCOS 2012: The 5th International Conference of Institutes and Libraries for Chinese Overseas Studies",
                    "viz": 1
                },
                "43418": {
                    "nick": "43418",
                    "title": "Faculty of Creative and Critical Studies Faculty Publications (Okanagan Campus)",
                    "viz": 1
                },
                "43600": {
                    "nick": "43600",
                    "title": "Family Practice Faculty Research",
                    "viz": 1
                },
                "43796": {
                    "nick": "43796",
                    "title": "KIN Research Papers",
                    "viz": 1
                },
                "43962": {
                    "nick": "43962",
                    "title": "Verna J. Kirkness - Speeches",
                    "viz": 1
                },
                "44121": {
                    "nick": "44121",
                    "title": "English Student Papers",
                    "viz": 1
                },
                "44311": {
                    "nick": "44311",
                    "title": "Xwi7xwa Library: First Nations House of Learning Collections",
                    "viz": 1
                },
                "44376": {
                    "nick": "44376",
                    "title": "Economics Faculty Research",
                    "viz": 1
                },
                "44377": {
                    "nick": "44377",
                    "title": "GEOG 429: Research in Historical Geography",
                    "viz": 1
                },
                "44392": {
                    "nick": "44392",
                    "title": "Science One Research Projects 2012-2013",
                    "viz": 1
                },
                "44550": {
                    "nick": "44550",
                    "title": "Central, Eastern, Northern European Studies (CENES) Faculty Research Publications",
                    "viz": 1
                },
                "44562": {
                    "nick": "graduateresearch",
                    "title": "Graduate Research"
                },
                "44632": {
                    "nick": "44632",
                    "title": "EDCP Student Graduating Papers",
                    "viz": 1
                },
                "44661": {
                    "nick": "44661",
                    "title": "Selected Retrospective Forestry Undergraduate Theses and Essays (pre-2009)",
                    "viz": 1
                },
                "45088": {
                    "nick": "45088",
                    "title": "EDCP Research Papers",
                    "viz": 1
                },
                "45132": {
                    "nick": "45132",
                    "title": "UBC Nursing Student Journal (UBC-NSJ), 2013",
                    "viz": 1
                },
                "45195": {
                    "nick": "45195",
                    "title": "Rheumatology Newsletters",
                    "viz": 1
                },
                "45204": {
                    "nick": "45204",
                    "title": "Screens in Vancouver: Cinemagoing and the City in 1914",
                    "viz": 1
                },
                "45226": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "45422": {
                    "nick": "45422",
                    "title": "Business Families Centre's White Paper Series: Research Matters",
                    "viz": 1
                },
                "45447": {
                    "nick": "45447",
                    "title": "Law Faculty Research",
                    "viz": 1
                },
                "45539": {
                    "nick": "45539",
                    "title": "LLED Student Research",
                    "viz": 1
                },
                "45578": {
                    "nick": "45578",
                    "title": "High-Throughput Biology (CHiBi) Research, Centre for",
                    "viz": 1
                },
                "45960": {
                    "nick": "45960",
                    "title": "UBC Community Engagement Projects",
                    "viz": 1
                },
                "46074": {
                    "nick": "46074",
                    "title": "Physics and Astronomy Faculty Publications and Reports",
                    "viz": 1
                },
                "46280": {
                    "nick": "46280",
                    "title": "Vancouver School of Theology Theses",
                    "viz": 1
                },
                "46343": {
                    "nick": "46343",
                    "title": "Adam Jones Global Photo Archive",
                    "viz": 1
                },
                "46601": {
                    "nick": "46601",
                    "title": "Sociology Undergraduate Honours Theses",
                    "viz": 1
                },
                "46624": {
                    "nick": "46624",
                    "title": "Consortium for Nursing History Inquiry",
                    "viz": 1
                },
                "46718": {
                    "nick": "46718",
                    "title": "PIMS Newsletter",
                    "viz": 1
                },
                "46721": {
                    "nick": "46721",
                    "title": "PIMS Year in Review",
                    "viz": 1
                },
                "46976": {
                    "nick": "46976",
                    "title": "Symposium on Early Modern Japanese Values and Individuality",
                    "viz": 1
                },
                "47057": {
                    "nick": "47057",
                    "title": "Linguistics Undergraduate Honours Theses",
                    "viz": 1
                },
                "47136": {
                    "nick": "47136",
                    "title": "CHSPR Publications",
                    "viz": 1
                },
                "48368": {
                    "nick": "48368",
                    "title": "Low Carbon Economy",
                    "viz": 1
                },
                "48441": {
                    "nick": "48441",
                    "title": "LLED Student Graduating Papers",
                    "viz": 1
                },
                "48503": {
                    "nick": "48503",
                    "title": "Health Human Resources Unit (HHRU) [1973-2002]",
                    "viz": 1
                },
                "48504": {
                    "nick": "48504",
                    "title": "British Columbia Office of Health Technology Assessment (BCOHTA) [1990-2002]",
                    "viz": 1
                },
                "48630": {
                    "nick": "48630",
                    "title": "BIRS Workshop Lecture Videos",
                    "viz": 1
                },
                "50126": {
                    "nick": "50126",
                    "title": "CUER Papers and Reports",
                    "viz": 1
                },
                "50252": {
                    "nick": "50252",
                    "title": "Health and Wellness",
                    "viz": 1
                },
                "50356": {
                    "nick": "50356",
                    "title": "Mathematics Undergraduate Student Research",
                    "viz": 1
                },
                "50555": {
                    "nick": "50555",
                    "title": "Leader in Residence",
                    "viz": 1
                },
                "50687": {
                    "nick": "50687",
                    "title": "Archaeological Site Reports",
                    "viz": 1
                },
                "50878": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "51184": {
                    "nick": "51184",
                    "title": "Centre for Sustainable Food Systems at UBC Farm Research",
                    "viz": 1
                },
                "51368": {
                    "nick": "51368",
                    "title": "Insights from NMR : A symposium in honour of Myer Bloom",
                    "viz": 1
                },
                "51832": {
                    "nick": "51832",
                    "title": "TRIUMF Technical Reports",
                    "viz": 1
                },
                "51833": {
                    "nick": "51833",
                    "title": "TRIUMF Annual Reports",
                    "viz": 1
                },
                "51869": {
                    "nick": "51869",
                    "title": "Science One Research Projects 2014+",
                    "viz": 1
                },
                "51871": {
                    "nick": "51871",
                    "title": "Physical Therapy Faculty Research and Publications",
                    "viz": 1
                },
                "52383": {
                    "nick": "52383",
                    "title": "Faculty Research and Publications",
                    "viz": 1
                },
                "52387": {
                    "nick": "52387",
                    "title": "UBC Community and Partner Publications",
                    "viz": 1
                },
                "52657": {
                    "nick": "52657",
                    "title": "EESD15 – The Seventh International Conference on Engineering Education for Sustainable Development",
                    "viz": 1
                },
                "52660": {
                    "nick": "52660",
                    "title": "ICSC15 – The Canadian Society for Civil Engineering’s 5th International/11th Construction Specialty Conference",
                    "viz": 1
                },
                "52966": {
                    "nick": "52966",
                    "title": "Undergraduate Research",
                    "viz": 1
                },
                "53032": {
                    "nick": "53032",
                    "title": "ICASP12 – 12th International Conference on Applications of Statistics and Probability in Civil Engineering",
                    "viz": 1
                },
                "53169": {
                    "nick": "53169",
                    "title": "UBC President's Speeches and Writings",
                    "viz": 1
                },
                "53926": {
                    "nick": "53926",
                    "title": "The 2015 International Conference on Health Promoting Universities and Colleges/VII International Congress",
                    "viz": 1
                },
                "55474": {
                    "nick": "55474",
                    "title": "Digital Library Federation (DLF)",
                    "viz": 1
                },
                "hundred": {
                    "nick": "hundred",
                    "title": "One Hundred Poets",
                    "viz": 1
                },
                "focus": {
                    "nick": "focus",
                    "title": "FOCUS",
                    "viz": 1
                },
                "biblos": {
                    "nick": "biblos",
                    "title": "University Publications - Biblos",
                    "viz": 1
                },
                "creelman": {
                    "nick": "creelman",
                    "title": "Lyle Creelman Fonds",
                    "viz": 1
                },
                "asian": {
                    "nick": "asian",
                    "title": "UBC Asian Library Rare Book Collection",
                    "viz": 1
                },
                "ecrosby": {
                    "nick": "ecrosby",
                    "title": "Emma Crosby Letters",
                    "viz": 1
                },
                "arphotos": {
                    "nick": "arphotos",
                    "title": "UBC Archives Photograph Collection",
                    "viz": 1
                },
                "tokugawa": {
                    "nick": "tokugawa",
                    "title": "Japanese Maps of the Tokugawa Era",
                    "viz": 1
                },
                "yipsang": {
                    "nick": "yipsang",
                    "title": "Yip Sang Collection",
                    "viz": 1
                },
                "manuscripts": {
                    "nick": "manuscripts",
                    "title": "Western Manuscripts",
                    "viz": 1
                },
                "alumchron": {
                    "nick": "alumchron",
                    "title": "UBC Alumni Chronicle",
                    "viz": 1
                },
                "calendars": {
                    "nick": "calendars",
                    "title": "UBC Calendars",
                    "viz": 1
                },
                "berkpost": {
                    "nick": "berkpost",
                    "title": "Berkeley 1968-1973 poster collection",
                    "viz": 1
                },
                "first100theses": {
                    "nick": "first100theses",
                    "title": "First Hundred Theses",
                    "viz": 1
                },
                "royalfisk": {
                    "nick": "royalfisk",
                    "title": "Royal Fisk Gold Rush Letters",
                    "viz": 1
                },
                "davidconde": {
                    "nick": "davidconde",
                    "title": "David Conde Fonds",
                    "viz": 1
                },
                "ubclsb": {
                    "nick": "ubclsb",
                    "title": "University Publications - UBC Library Staff Bulletin",
                    "viz": 1
                },
                "bcsessional": {
                    "nick": "bcsessional",
                    "title": "BC Sessional Papers",
                    "viz": 1
                },
                "ubclsmm": {
                    "nick": "ubclsmm",
                    "title": "University Publications - UBC Library Staff Meeting Minutes",
                    "viz": 1
                },
                "ohs": {
                    "nick": "ohs",
                    "title": "Okanagan Historical Society Reports",
                    "viz": 1
                },
                "chungosgr": {
                    "nick": "chungosgr",
                    "title": "Chung Oversize and Graphic Materials",
                    "viz": 1
                },
                "dorothyburn": {
                    "nick": "dorothyburn",
                    "title": "Dorothy Burnett Bookbinding Tools",
                    "viz": 1
                },
                "citraudio": {
                    "nick": "citraudio",
                    "title": "CiTR Audio Tapes",
                    "viz": 1
                },
                "prism": {
                    "nick": "prism",
                    "title": "PRISM international",
                    "viz": 1
                },
                "ubcavfrc": {
                    "nick": "ubcavfrc",
                    "title": "UBC Legacy Video Collection",
                    "viz": 1
                },
                "fisheries": {
                    "nick": "fisheries",
                    "title": "UBC Institute of Fisheries Field Records",
                    "viz": 1
                },
                "rosetti": {
                    "nick": "rosetti",
                    "title": "Rosetti Studios - Stanley Park Collection",
                    "viz": 1
                },
                "arkley": {
                    "nick": "arkley",
                    "title": "Tremaine Arkley Croquet Collection",
                    "viz": 1
                },
                "gvrdmaps": {
                    "nick": "gvrdmaps",
                    "title": "Greater Vancouver Regional District Planning Department Land Use Maps",
                    "viz": 1
                },
                "squeezes": {
                    "nick": "squeezes",
                    "title": "Epigraphic Squeezes",
                    "viz": 1
                },
                "archivesav": {
                    "nick": "archivesav",
                    "title": "UBC Archives Audio Recordings Collection",
                    "viz": 1
                },
                "vma": {
                    "nick": "vma",
                    "title": "Vancouver Medical Association",
                    "viz": 1
                },
                "fisherman": {
                    "nick": "fisherman",
                    "title": "Fisherman Publishing Society Collection",
                    "viz": 1
                },
                "darwin": {
                    "nick": "darwin",
                    "title": "Charles Darwin letters",
                    "viz": 1
                },
                "goldenera": {
                    "nick": "goldenera",
                    "title": "Newspapers - Golden Era",
                    "viz": 1
                },
                "delgamuukw": {
                    "nick": "delgamuukw",
                    "title": "Delgamuukw Trial Transcripts",
                    "viz": 1
                },
                "davidsonia": {
                    "nick": "davidsonia",
                    "title": "Davidsonia",
                    "viz": 1
                },
                "feeders": {
                    "nick": "feeders",
                    "title": "Infant Feeders Collection",
                    "viz": 1
                },
                "johnkeenlyside": {
                    "nick": "johnkeenlyside",
                    "title": "John Keenlyside Legal Research Collection",
                    "viz": 1
                },
                "florence": {
                    "nick": "florence",
                    "title": "Florence Nightingale Letters",
                    "viz": 1
                },
                "saga": {
                    "nick": "saga",
                    "title": "SAGA Document Collection",
                    "viz": 1
                },
                "specialp": {
                    "nick": "specialp",
                    "title": "UBC Library Digitization Centre Special Projects",
                    "viz": 1
                },
                "artefacts": {
                    "nick": "artefacts",
                    "title": "Ancient Artefacts",
                    "viz": 1
                },
                "wwposters": {
                    "nick": "wwposters",
                    "title": "WWI & WWII Posters",
                    "viz": 1
                },
                "tgdp": {
                    "nick": "tgdp",
                    "title": "Traité général des pesches",
                    "viz": 1
                },
                "mccormick": {
                    "nick": "mccormick",
                    "title": "Andrew McCormick Maps and Prints",
                    "viz": 1
                },
                "langmann": {
                    "nick": "langmann",
                    "title": "Uno Langmann Family Collection of BC Photographs",
                    "viz": 1
                },
                "wwiphoto": {
                    "nick": "wwiphoto",
                    "title": "World War I British press photograph collection",
                    "viz": 1
                },
                "westland": {
                    "nick": "westland",
                    "title": "Westland",
                    "viz": 1
                },
                "macmillan": {
                    "nick": "macmillan",
                    "title": "MacMillan Bloedel Limited fonds",
                    "viz": 1
                },
                "kinesis": {
                    "nick": "kinesis",
                    "title": "Kinesis",
                    "viz": 1
                },
                "anderson": {
                    "nick": "anderson",
                    "title": "Peter Anderson fonds",
                    "viz": 1
                },
                "tairikunipp": {
                    "nick": "tairikunipp",
                    "title": "Tairiku Nippo (Continental Daily News)",
                    "viz": 1
                },
                "capilano": {
                    "nick": "capilano",
                    "title": "Capilano Timber Company fonds",
                    "viz": 1
                },
                "bch": {
                    "nick": "bch",
                    "title": "British Columbia History",
                    "viz": 1
                },
                "ubclibnews": {
                    "nick": "ubclibnews",
                    "title": "University Publications - UBC Library News",
                    "viz": 1
                },
                "mathison": {
                    "nick": "mathison",
                    "title": "R. Mathison Collection",
                    "viz": 1
                },
                "bullock": {
                    "nick": "bullock",
                    "title": "H. Bullock-Webster fonds",
                    "viz": 1
                },
                "touchpoints": {
                    "nick": "touchpoints",
                    "title": "Touchpoints",
                    "viz": 1
                },
                "jphotos": {
                    "nick": "jphotos",
                    "title": "Japanese Canadian Photograph Collection",
                    "viz": 1
                },
                "bookplate": {
                    "nick": "bookplate",
                    "title": "RBSC Bookplates",
                    "viz": 1
                },
                "columbiarev": {
                    "nick": "columbiarev",
                    "title": "Newspapers - Columbia Review",
                    "viz": 1
                },
                "framed": {
                    "nick": "framed",
                    "title": "UBC Library Framed Works Collection",
                    "viz": 1
                },
                "paccannw": {
                    "nick": "paccannw",
                    "title": "Newspapers - Pacific Canadian (New Westminster)",
                    "viz": 1
                },
                "slodrill": {
                    "nick": "slodrill",
                    "title": "Newspapers - Slocan Drill",
                    "viz": 1
                },
                "bcbooks": {
                    "nick": "bcbooks",
                    "title": "BC Historical Books",
                    "viz": 1
                },
                "evewoross": {
                    "nick": "evewoross",
                    "title": "Newspapers - Evening World (Rossland)",
                    "viz": 1
                },
                "princero": {
                    "nick": "princero",
                    "title": "Newspapers - Prince Rupert Optimist",
                    "viz": 1
                },
                "slorec": {
                    "nick": "slorec",
                    "title": "Newspapers - Slocan Record",
                    "viz": 1
                },
                "ubcrd": {
                    "nick": "ubcrd",
                    "title": "UBC Research Data",
                    "viz": 1
                },
                "discorder": {
                    "nick": "discorder",
                    "title": "Discorder",
                    "viz": 1
                },
                "chungex": {
                    "nick": "chung",
                    "title": "The Chung Collection"
                },
                "xalberniadv": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "proslill": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "xabpost": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "xanaconda": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "penpress": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "thestar": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "chungphotos": {
                    "nick": "chung",
                    "title": "The Chung Collection"
                },
                "chungtext": {
                    "nick": "chung",
                    "title": "The Chung Collection"
                },
                "thesun": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "xbcrecord": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "xcoastnews": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "xcrestonrev": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "xcumberland": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "xenderby": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "xgrandforks": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "xhedley": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "xindependen": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "xkootmail": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "xdailyledg": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "xbellacoo": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "xdbr": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "xhotsprings": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "xkelownarec": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "xatlin": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "xboundarycr": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "xcariboosen": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "xrevherald": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "westho": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "cascade": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "greemine": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "chasetrib": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "goldentimes": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "echo": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "xnakledge": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "xledgreen": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "xmassett": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "xminer": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "xminingrev": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "xmoyie": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "xnelsonecon": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "xnicola": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "xorchardcit": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "xpentimes": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "xphoenix": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "xprospector": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "xtribune": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "xwestcall": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "etheljohns": {
                    "nick": "etheljohns",
                    "title": "Ethel Johns Fonds"
                },
                "nwminer": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "nursing": {
                    "nick": "nursing",
                    "title": "History of Nursing in Pacific Canada"
                },
                "smreview": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "agassiz": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "evenkoot": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "canford": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "nanacour": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "ubcstuhan": {
                    "nick": "ubcpublications",
                    "title": "UBC Publications"
                },
                "locla": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "omineca": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "ominecaminer": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "koolib": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "ubcreports": {
                    "nick": "ubcpublications",
                    "title": "UBC Publications"
                },
                "iel": {
                    "nick": "ubcpublications",
                    "title": "UBC Publications"
                },
                "upubmisc": {
                    "nick": "ubcpublications",
                    "title": "UBC Publications"
                },
                "presrep": {
                    "nick": "ubcpublications",
                    "title": "UBC Publications"
                },
                "libsenrep": {
                    "nick": "ubcpublications",
                    "title": "UBC Publications"
                },
                "ubchist": {
                    "nick": "ubcpublications",
                    "title": "UBC Publications"
                },
                "ubctp": {
                    "nick": "ubcpublications",
                    "title": "UBC Publications"
                },
                "ubcyearb": {
                    "nick": "ubcpublications",
                    "title": "UBC Publications"
                },
                "senmin": {
                    "nick": "ubcpublications",
                    "title": "UBC Publications"
                },
                "eastkootmine": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "cranherald": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "htimes": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "fraseradvanc": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "despatch": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "misscity": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "chungpub": {
                    "nick": "chung",
                    "title": "The Chung Collection"
                },
                "nanamail": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "cwn": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "chilliwackfp": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "dcanadi": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "hqueek": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "ardeau": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "ubcmedicine": {
                    "nick": "ubcpublications",
                    "title": "UBC Publications"
                },
                "peloyalist": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "ndaymine": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "kwawa": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "delttime": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "marytrib": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "beaverdell": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "daytele": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "enterprise": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "the432": {
                    "nick": "ubcpublications",
                    "title": "UBC Publications"
                },
                "mminer": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "gfminer": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "cranbrookpro": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "arlaadvo": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "armstrongad": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "lilladva": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "brooklynnews": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "croftongaz": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "courtenayrev": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "cumberlandis": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "deltnews": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "mmention": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "surreytimes": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "bcnews": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "coasmine": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "laborstar": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "redflag": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "slocanp": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "thenugget": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "cg": {
                    "nick": "ubcpublications",
                    "title": "UBC Publications"
                },
                "ubysseynews": {
                    "nick": "ubcpublications",
                    "title": "UBC Publications"
                },
                "bcnewspapers": {
                    "nick": "bcnewspapers",
                    "title": "BC Historical Newspapers"
                },
                "bcminereclamationsymposium": {
                    "nick": "bcminereclamationsymposium",
                    "title": "BC Mine Reclamation Symposium"
                },
                "historyofnursinginpacificcanada": {
                    "nick": "historyofnursinginpacificcanada",
                    "title": "History of Nursing in Pacific Canada"
                },
                "ubctheses": {
                    "nick": "ubctheses",
                    "title": "UBC Theses and Dissertations"
                },
                "chung": {
                    "nick": "chung",
                    "title": "The Chung Collection"
                },
                "graduateresearch": {
                    "nick": "graduateresearch",
                    "title": "Graduate Research"
                },
                "cihr": {
                    "nick": "cihr",
                    "title": "CIHR"
                },
                "ubcpublications": {
                    "nick": "ubcpublications",
                    "title": "UBC Publications"
                }
            };
            var colsAndAggData = {
                "data": {
                    "aggregates": {
                        "bcnewspapers": {
                            "nick": "bcnewspapers",
                            "title": "BC Historical Newspapers",
                            "viz": 1,
                            "csv": "xalberniadv,proslill,xabpost,xanaconda,penpress,thestar,thesun,xbcrecord,xcoastnews,xcrestonrev,xcumberland,xenderby,xgrandforks,xhedley,xindependen,xkootmail,xdailyledg,xbellacoo,xdbr,xhotsprings,xkelownarec,xatlin,xboundarycr,xcariboosen,xrevherald,westho,cascade,greemine,chasetrib,goldentimes,echo,xnakledge,xledgreen,xmassett,xminer,xminingrev,xmoyie,xnelsonecon,xnicola,xorchardcit,xpentimes,xphoenix,xprospector,xtribune,xwestcall,nwminer,smreview,agassiz,evenkoot,canford,nanacour,locla,omineca,ominecaminer,koolib,eastkootmine,cranherald,htimes,fraseradvanc,despatch,misscity,nanamail,cwn,chilliwackfp,dcanadi,hqueek,ardeau,peloyalist,ndaymine,kwawa,delttime,marytrib,beaverdell,daytele,enterprise,mminer,gfminer,cranbrookpro,arlaadvo,armstrongad,lilladva,brooklynnews,croftongaz,courtenayrev,cumberlandis,deltnews,mmention,surreytimes,bcnews,coasmine,laborstar,redflag,slocanp,thenugget"
                        },
                        "bcminereclamationsymposium": {
                            "nick": "bcminereclamationsymposium",
                            "title": "BC Mine Reclamation Symposium",
                            "viz": 1,
                            "csv": "50878,9096,7473,7474,7898,7897,6944,6936,11135,9374,9373,9372,9371,9098,9378,9377,11128,11126,11125,11124,11123,11122,11119,9379,11242,11241,11237,11233,7476,7899,7900,11243,43342,20212,30115,42036,9376,45226"
                        },
                        "historyofnursinginpacificcanada": {
                            "nick": "historyofnursinginpacificcanada",
                            "title": "History of Nursing in Pacific Canada",
                            "viz": 1,
                            "csv": "nursing,etheljohns"
                        },
                        "ubctheses": {
                            "nick": "ubctheses",
                            "title": "UBC Theses and Dissertations",
                            "viz": 1,
                            "csv": "831,24"
                        },
                        "chung": {
                            "nick": "chung",
                            "title": "The Chung Collection",
                            "viz": 1,
                            "csv": "chungpub,chungex,chungphotos,chungtext"
                        },
                        "graduateresearch": {
                            "nick": "graduateresearch",
                            "title": "Graduate Research",
                            "viz": 1,
                            "csv": "44562"
                        },
                        "cihr": {
                            "nick": "cihr",
                            "title": "CIHR",
                            "viz": 1,
                            "csv": "8833,12547,26566,41904"
                        },
                        "ubcpublications": {
                            "nick": "ubcpublications",
                            "title": "UBC Publications",
                            "viz": 1,
                            "csv": "ubcstuhan,ubcreports,iel,upubmisc,presrep,libsenrep,ubchist,ubctp,ubcyearb,senmin,ubcmedicine,the432,cg,ubysseynews"
                        }
                    },
                    "sub_cols": {
                        "24": {
                            "nick": "24",
                            "title": "Electronic Theses and Dissertations (ETDs) 2008+",
                            "viz": 0,
                            "parent": "ubctheses"
                        },
                        "831": {
                            "nick": "831",
                            "title": "Retrospective Theses and Dissertations, 1919-2007",
                            "viz": 0,
                            "parent": "ubctheses"
                        },
                        "6936": {
                            "nick": "6936",
                            "title": "B.C. Mine Reclamation Symposium 2008",
                            "viz": 0,
                            "parent": "bcminereclamationsymposium"
                        },
                        "6944": {
                            "nick": "6944",
                            "title": "B.C. Mine Reclamation Symposium 2007",
                            "viz": 0,
                            "parent": "bcminereclamationsymposium"
                        },
                        "7473": {
                            "nick": "7473",
                            "title": "B.C. Mine Reclamation Symposium 2000",
                            "viz": 0,
                            "parent": "bcminereclamationsymposium"
                        },
                        "7474": {
                            "nick": "7474",
                            "title": "B.C. Mine Reclamation Symposium 2001",
                            "viz": 0,
                            "parent": "bcminereclamationsymposium"
                        },
                        "7476": {
                            "nick": "7476",
                            "title": "B.C. Mine Reclamation Symposium 2002",
                            "viz": 0,
                            "parent": "bcminereclamationsymposium"
                        },
                        "7897": {
                            "nick": "7897",
                            "title": "B.C. Mine Reclamation Symposium 2006",
                            "viz": 0,
                            "parent": "bcminereclamationsymposium"
                        },
                        "7898": {
                            "nick": "7898",
                            "title": "B.C. Mine Reclamation Symposium 2005",
                            "viz": 0,
                            "parent": "bcminereclamationsymposium"
                        },
                        "7899": {
                            "nick": "7899",
                            "title": "B.C. Mine Reclamation Symposium 2003",
                            "viz": 0,
                            "parent": "bcminereclamationsymposium"
                        },
                        "7900": {
                            "nick": "7900",
                            "title": "B.C. Mine Reclamation Symposium 2004",
                            "viz": 0,
                            "parent": "bcminereclamationsymposium"
                        },
                        "8833": {
                            "nick": "8833",
                            "title": "CIHR Research Outputs 2008",
                            "viz": 1,
                            "parent": "cihr"
                        },
                        "9096": {
                            "nick": "9096",
                            "title": "B.C. Mine Reclamation Symposium 1999",
                            "viz": 0,
                            "parent": "bcminereclamationsymposium"
                        },
                        "9098": {
                            "nick": "9098",
                            "title": "B.C. Mine Reclamation Symposium 1998",
                            "viz": 0,
                            "parent": "bcminereclamationsymposium"
                        },
                        "9371": {
                            "nick": "9371",
                            "title": "B.C. Mine Reclamation Symposium 1997",
                            "viz": 0,
                            "parent": "bcminereclamationsymposium"
                        },
                        "9372": {
                            "nick": "9372",
                            "title": "B.C. Mine Reclamation Symposium 1996",
                            "viz": 0,
                            "parent": "bcminereclamationsymposium"
                        },
                        "9373": {
                            "nick": "9373",
                            "title": "B.C. Mine Reclamation Symposium 1995",
                            "viz": 0,
                            "parent": "bcminereclamationsymposium"
                        },
                        "9374": {
                            "nick": "9374",
                            "title": "B.C. Mine Reclamation Symposium 1994",
                            "viz": 0,
                            "parent": "bcminereclamationsymposium"
                        },
                        "9376": {
                            "nick": "9376",
                            "title": "B.C. Mine Reclamation Symposium 1993",
                            "viz": 0,
                            "parent": "bcminereclamationsymposium"
                        },
                        "9377": {
                            "nick": "9377",
                            "title": "B.C. Mine Reclamation Symposium 1992",
                            "viz": 0,
                            "parent": "bcminereclamationsymposium"
                        },
                        "9378": {
                            "nick": "9378",
                            "title": "B.C. Mine Reclamation Symposium 1991",
                            "viz": 0,
                            "parent": "bcminereclamationsymposium"
                        },
                        "9379": {
                            "nick": "9379",
                            "title": "B.C. Mine Reclamation Symposium 1990",
                            "viz": 0,
                            "parent": "bcminereclamationsymposium"
                        },
                        "11119": {
                            "nick": "11119",
                            "title": "B.C. Mine Reclamation Symposium 1989",
                            "viz": 0,
                            "parent": "bcminereclamationsymposium"
                        },
                        "11122": {
                            "nick": "11122",
                            "title": "B.C. Mine Reclamation Symposium 1988",
                            "viz": 0,
                            "parent": "bcminereclamationsymposium"
                        },
                        "11123": {
                            "nick": "11123",
                            "title": "B.C. Mine Reclamation Symposium 1987",
                            "viz": 0,
                            "parent": "bcminereclamationsymposium"
                        },
                        "11124": {
                            "nick": "11124",
                            "title": "B.C. Mine Reclamation Symposium 1986",
                            "viz": 0,
                            "parent": "bcminereclamationsymposium"
                        },
                        "11125": {
                            "nick": "11125",
                            "title": "B.C. Mine Reclamation Symposium 1985",
                            "viz": 0,
                            "parent": "bcminereclamationsymposium"
                        },
                        "11126": {
                            "nick": "11126",
                            "title": "B.C. Mine Reclamation Symposium 1984",
                            "viz": 0,
                            "parent": "bcminereclamationsymposium"
                        },
                        "11128": {
                            "nick": "11128",
                            "title": "B.C. Mine Reclamation Symposium 1983",
                            "viz": 0,
                            "parent": "bcminereclamationsymposium"
                        },
                        "11135": {
                            "nick": "11135",
                            "title": "B.C. Mine Reclamation Symposium 1982",
                            "viz": 0,
                            "parent": "bcminereclamationsymposium"
                        },
                        "11233": {
                            "nick": "11233",
                            "title": "B.C. Mine Reclamation Symposium 1981",
                            "viz": 0,
                            "parent": "bcminereclamationsymposium"
                        },
                        "11237": {
                            "nick": "11237",
                            "title": "B.C. Mine Reclamation Symposium 1980",
                            "viz": 0,
                            "parent": "bcminereclamationsymposium"
                        },
                        "11241": {
                            "nick": "11241",
                            "title": "B.C. Mine Reclamation Symposium 1979",
                            "viz": 0,
                            "parent": "bcminereclamationsymposium"
                        },
                        "11242": {
                            "nick": "11242",
                            "title": "B.C. Mine Reclamation Symposium 1978",
                            "viz": 0,
                            "parent": "bcminereclamationsymposium"
                        },
                        "11243": {
                            "nick": "11243",
                            "title": "B.C. Mine Reclamation Symposium 1977",
                            "viz": 0,
                            "parent": "bcminereclamationsymposium"
                        },
                        "12547": {
                            "nick": "12547",
                            "title": "CIHR Research Outputs 2009",
                            "viz": 1,
                            "parent": "cihr"
                        },
                        "20212": {
                            "nick": "20212",
                            "title": "B.C. Mine Reclamation Symposium 2009",
                            "viz": 0,
                            "parent": "bcminereclamationsymposium"
                        },
                        "26566": {
                            "nick": "26566",
                            "title": "CIHR Research Outputs 2010",
                            "viz": 1,
                            "parent": "cihr"
                        },
                        "30115": {
                            "nick": "30115",
                            "title": "B.C. Mine Reclamation Symposium 2010",
                            "viz": 0,
                            "parent": "bcminereclamationsymposium"
                        },
                        "41904": {
                            "nick": "41904",
                            "title": "CIHR Research Outputs 2011+",
                            "viz": 1,
                            "parent": "cihr"
                        },
                        "42036": {
                            "nick": "42036",
                            "title": "B.C. Mine Reclamation Symposium 2011",
                            "viz": 0,
                            "parent": "bcminereclamationsymposium"
                        },
                        "43342": {
                            "nick": "43342",
                            "title": "B.C. Mine Reclamation Symposium 2012",
                            "viz": 0,
                            "parent": "bcminereclamationsymposium"
                        },
                        "44562": {
                            "nick": "44562",
                            "title": "IRES Working Papers",
                            "viz": 0,
                            "parent": "graduateresearch"
                        },
                        "45226": {
                            "nick": "45226",
                            "title": "B.C. Mine Reclamation Symposium 2013",
                            "viz": 0,
                            "parent": "bcminereclamationsymposium"
                        },
                        "50878": {
                            "nick": "50878",
                            "title": "B.C. Mine Reclamation Symposium 2014",
                            "viz": 0,
                            "parent": "bcminereclamationsymposium"
                        },
                        "chungex": {
                            "nick": "chungex",
                            "title": "Chung Exhibit Items",
                            "viz": 0,
                            "parent": "chung"
                        },
                        "xalberniadv": {
                            "nick": "xalberniadv",
                            "title": "Newspapers - Alberni Advocate",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "proslill": {
                            "nick": "proslill",
                            "title": "Newspapers - Prospector (Lillooet)",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "xabpost": {
                            "nick": "xabpost",
                            "title": "Newspapers - The Abbotsford Post",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "xanaconda": {
                            "nick": "xanaconda",
                            "title": "Newspapers - The Anaconda News",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "penpress": {
                            "nick": "penpress",
                            "title": "Newspapers - The Penticton Press",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "thestar": {
                            "nick": "thestar",
                            "title": "Newspapers - The Star (Port Essington)",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "chungphotos": {
                            "nick": "chungphotos",
                            "title": "Chung Photographs",
                            "viz": 0,
                            "parent": "chung"
                        },
                        "chungtext": {
                            "nick": "chungtext",
                            "title": "Chung Textual Materials",
                            "viz": 0,
                            "parent": "chung"
                        },
                        "thesun": {
                            "nick": "thesun",
                            "title": "Newspapers - The Sun (Port Essington)",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "xbcrecord": {
                            "nick": "xbcrecord",
                            "title": "Newspapers - British Columbia Record",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "xcoastnews": {
                            "nick": "xcoastnews",
                            "title": "Newspapers - The Coast News (Gibsons)",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "xcrestonrev": {
                            "nick": "xcrestonrev",
                            "title": "Newspapers - The Creston Review",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "xcumberland": {
                            "nick": "xcumberland",
                            "title": "Newspapers - The Cumberland News",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "xenderby": {
                            "nick": "xenderby",
                            "title": "Newspapers - The Enderby Press and Walker's Weekly",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "xgrandforks": {
                            "nick": "xgrandforks",
                            "title": "Newspapers - The Grand Forks Sun",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "xhedley": {
                            "nick": "xhedley",
                            "title": "Newspapers - The Hedley Gazette",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "xindependen": {
                            "nick": "xindependen",
                            "title": "Newspapers - The Independent (Vancouver)",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "xkootmail": {
                            "nick": "xkootmail",
                            "title": "Newspapers - The Kootenay Mail",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "xdailyledg": {
                            "nick": "xdailyledg",
                            "title": "newspapers - The Daily Ledger (Ladysmith)",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "xbellacoo": {
                            "nick": "xbellacoo",
                            "title": "Newspapers - Bella Coola Courier",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "xdbr": {
                            "nick": "xdbr",
                            "title": "Newspapers - Daily Building Record",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "xhotsprings": {
                            "nick": "xhotsprings",
                            "title": "Newspapers - Hot Springs News (Ainsworth)",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "xkelownarec": {
                            "nick": "xkelownarec",
                            "title": "Newspapers - Kelowna Record",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "xatlin": {
                            "nick": "xatlin",
                            "title": "Newspapers - The Atlin Claim",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "xboundarycr": {
                            "nick": "xboundarycr",
                            "title": "Newspapers - The Boundary Creek Times",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "xcariboosen": {
                            "nick": "xcariboosen",
                            "title": "Newspapers - The Cariboo Sentinel (Barkerville)",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "xrevherald": {
                            "nick": "xrevherald",
                            "title": "Newspapers - Revelstoke Herald",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "westho": {
                            "nick": "westho",
                            "title": "Newspapers - Westward Ho!",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "cascade": {
                            "nick": "cascade",
                            "title": "Newspapers - Cascade Record",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "greemine": {
                            "nick": "greemine",
                            "title": "Newspapers - The Greenwood Miner",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "chasetrib": {
                            "nick": "chasetrib",
                            "title": "Newspapers - Chase Tribune",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "goldentimes": {
                            "nick": "goldentimes",
                            "title": "Newspapers - Golden Times",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "echo": {
                            "nick": "echo",
                            "title": "Newspapers - Echo (Duncan)",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "xnakledge": {
                            "nick": "xnakledge",
                            "title": "Newspapers - The Ledge (Fernie, Nakusp, New Denver)",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "xledgreen": {
                            "nick": "xledgreen",
                            "title": "Newspapers - The Ledge (Greenwood)",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "xmassett": {
                            "nick": "xmassett",
                            "title": "Newspapers - The Massett Leader",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "xminer": {
                            "nick": "xminer",
                            "title": "Newspapers - The Miner (Nelson)",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "xminingrev": {
                            "nick": "xminingrev",
                            "title": "Newspapers - The Mining Review (Sandon)",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "xmoyie": {
                            "nick": "xmoyie",
                            "title": "Newspapers - The Moyie Leader",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "xnelsonecon": {
                            "nick": "xnelsonecon",
                            "title": "Newspapers - The Nelson Economist",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "xnicola": {
                            "nick": "xnicola",
                            "title": "Newspapers - The Nicola Valley News (Merritt)",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "xorchardcit": {
                            "nick": "xorchardcit",
                            "title": "Newspapers - The Orchard City Record (Kelowna)",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "xpentimes": {
                            "nick": "xpentimes",
                            "title": "Newspapers - The Peninsula Times",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "xphoenix": {
                            "nick": "xphoenix",
                            "title": "Newspapers - The Phoenix Pioneer",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "xprospector": {
                            "nick": "xprospector",
                            "title": "Newspapers - The Prospector (Fort Steele)",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "xtribune": {
                            "nick": "xtribune",
                            "title": "Newspapers - The Tribune (Nelson)",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "xwestcall": {
                            "nick": "xwestcall",
                            "title": "Newspapers - The Western Call (Vancouver)",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "etheljohns": {
                            "nick": "etheljohns",
                            "title": "Ethel Johns Fonds",
                            "viz": 1,
                            "parent": "historyofnursinginpacificcanada"
                        },
                        "nwminer": {
                            "nick": "nwminer",
                            "title": "Newspapers - Nelson Weekly Miner",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "nursing": {
                            "nick": "nursing",
                            "title": "History of Nursing in Pacific Canada",
                            "viz": 1,
                            "parent": "historyofnursinginpacificcanada"
                        },
                        "smreview": {
                            "nick": "smreview",
                            "title": "Newspapers - Slocan Mining Review",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "agassiz": {
                            "nick": "agassiz",
                            "title": "Newspapers - Agassiz Record",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "evenkoot": {
                            "nick": "evenkoot",
                            "title": "Newspapers - The Evening Kootenaian",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "canford": {
                            "nick": "canford",
                            "title": "Newspapers - Canford Radium",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "nanacour": {
                            "nick": "nanacour",
                            "title": "Newspapers - The Nanaimo Courier",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "ubcstuhan": {
                            "nick": "ubcstuhan",
                            "title": "University Publications - UBC Student Handbooks",
                            "viz": 0,
                            "parent": "ubcpublications"
                        },
                        "locla": {
                            "nick": "locla",
                            "title": "Newspapers - Lowery's Claim",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "omineca": {
                            "nick": "omineca",
                            "title": "Newspapers - Omineca Herald (Hazelton)",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "ominecaminer": {
                            "nick": "ominecaminer",
                            "title": "Newspapers - Omineca Miner (Hazelton)",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "koolib": {
                            "nick": "koolib",
                            "title": "Newspapers - The Kootenay Liberal",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "ubcreports": {
                            "nick": "ubcreports",
                            "title": "UBC Reports",
                            "viz": 0,
                            "parent": "ubcpublications"
                        },
                        "iel": {
                            "nick": "iel",
                            "title": "University Publications - Indian Education Newsletter",
                            "viz": 0,
                            "parent": "ubcpublications"
                        },
                        "upubmisc": {
                            "nick": "upubmisc",
                            "title": "University Publications - Miscellaneous Documents",
                            "viz": 0,
                            "parent": "ubcpublications"
                        },
                        "presrep": {
                            "nick": "presrep",
                            "title": "University Publications - Presidents’ Reports",
                            "viz": 0,
                            "parent": "ubcpublications"
                        },
                        "libsenrep": {
                            "nick": "libsenrep",
                            "title": "University Publications - Report of the University Librarian to the Senate",
                            "viz": 0,
                            "parent": "ubcpublications"
                        },
                        "ubchist": {
                            "nick": "ubchist",
                            "title": "University Publications - UBC History",
                            "viz": 0,
                            "parent": "ubcpublications"
                        },
                        "ubctp": {
                            "nick": "ubctp",
                            "title": "University Publications - UBC Theatre Programmes",
                            "viz": 0,
                            "parent": "ubcpublications"
                        },
                        "ubcyearb": {
                            "nick": "ubcyearb",
                            "title": "University Publications - UBC Yearbooks",
                            "viz": 0,
                            "parent": "ubcpublications"
                        },
                        "senmin": {
                            "nick": "senmin",
                            "title": "Senate Minutes",
                            "viz": 0,
                            "parent": "ubcpublications"
                        },
                        "eastkootmine": {
                            "nick": "eastkootmine",
                            "title": "Newspapers - East Kootenay Miner (Golden)",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "cranherald": {
                            "nick": "cranherald",
                            "title": "Newspapers - Cranbrook Herald",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "htimes": {
                            "nick": "htimes",
                            "title": "Newspapers - The Hosmer Times",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "fraseradvanc": {
                            "nick": "fraseradvanc",
                            "title": "Newspapers - Fraser Advance (Chilliwack)",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "despatch": {
                            "nick": "despatch",
                            "title": "Newspapers - The Despatch (Morrissey)",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "misscity": {
                            "nick": "misscity",
                            "title": "Newspapers - The Mission City News",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "chungpub": {
                            "nick": "chungpub",
                            "title": "Chung Published Works",
                            "viz": 0,
                            "parent": "chung"
                        },
                        "nanamail": {
                            "nick": "nanamail",
                            "title": "Newspapers - The Nanaimo Mail",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "cwn": {
                            "nick": "cwn",
                            "title": "Newspapers - Courtenay Weekly News",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "chilliwackfp": {
                            "nick": "chilliwackfp",
                            "title": "Newspapers - Chilliwack Free Press",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "dcanadi": {
                            "nick": "dcanadi",
                            "title": "Newspapers - The Daily Canadian",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "hqueek": {
                            "nick": "hqueek",
                            "title": "Newspapers - Hazelton Queek",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "ardeau": {
                            "nick": "ardeau",
                            "title": "Newspapers - Lardeau Eagle (Ferguson)",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "ubcmedicine": {
                            "nick": "ubcmedicine",
                            "title": "UBC Medicine",
                            "viz": 0,
                            "parent": "ubcpublications"
                        },
                        "peloyalist": {
                            "nick": "peloyalist",
                            "title": "Newspapers - Port Essington Loyalist",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "ndaymine": {
                            "nick": "ndaymine",
                            "title": "Newspapers - Nelson Daily Miner",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "kwawa": {
                            "nick": "kwawa",
                            "title": "Newspapers - Kamloops Wawa",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "delttime": {
                            "nick": "delttime",
                            "title": "Newspapers - The Delta Times",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "marytrib": {
                            "nick": "marytrib",
                            "title": "Newspapers - The Marysville Tribune",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "beaverdell": {
                            "nick": "beaverdell",
                            "title": "Newspapers - West Forks News (Beaverdell)",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "daytele": {
                            "nick": "daytele",
                            "title": "Newspapers - The Daily Telegram",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "enterprise": {
                            "nick": "enterprise",
                            "title": "Newspapers - Duncan Enterprise",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "the432": {
                            "nick": "the432",
                            "title": "432",
                            "viz": 0,
                            "parent": "ubcpublications"
                        },
                        "mminer": {
                            "nick": "mminer",
                            "title": "Newspapers - The Morrissey Miner",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "gfminer": {
                            "nick": "gfminer",
                            "title": "Newspapers - The Grand Forks Miner",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "cranbrookpro": {
                            "nick": "cranbrookpro",
                            "title": "Newspapers - Prospector (Cranbrook)",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "arlaadvo": {
                            "nick": "arlaadvo",
                            "title": "Newspapers - Arrow Lake Advocate",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "armstrongad": {
                            "nick": "armstrongad",
                            "title": "Newspapers - Armstrong Advance",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "lilladva": {
                            "nick": "lilladva",
                            "title": "Newspapers - The Lillooet Advance",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "brooklynnews": {
                            "nick": "brooklynnews",
                            "title": "Newspapers - Brooklyn News",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "croftongaz": {
                            "nick": "croftongaz",
                            "title": "Newspapers - Crofton Gazette and Cowichan News",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "courtenayrev": {
                            "nick": "courtenayrev",
                            "title": "Newspapers - Courtenay Review",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "cumberlandis": {
                            "nick": "cumberlandis",
                            "title": "Newspapers - Cumberland Islander",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "deltnews": {
                            "nick": "deltnews",
                            "title": "Newspapers - The Delta News",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "mmention": {
                            "nick": "mmention",
                            "title": "Newspapers - The Morrissey Mention",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "surreytimes": {
                            "nick": "surreytimes",
                            "title": "Newspapers - Surrey Times (Cloverdale)",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "bcnews": {
                            "nick": "bcnews",
                            "title": "Newspapers - British Columbia News",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "coasmine": {
                            "nick": "coasmine",
                            "title": "Newspapers - Coast Miner (Van Anda)",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "laborstar": {
                            "nick": "laborstar",
                            "title": "Newspapers - Labor Star (Vancouver)",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "redflag": {
                            "nick": "redflag",
                            "title": "Newspapers - Red Flag (Vancouver)",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "slocanp": {
                            "nick": "slocanp",
                            "title": "Newspapers - Slocan Prospector",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "thenugget": {
                            "nick": "thenugget",
                            "title": "Newspapers - The Nugget",
                            "viz": 0,
                            "parent": "bcnewspapers"
                        },
                        "cg": {
                            "nick": "cg",
                            "title": "Creative Giving",
                            "viz": 0,
                            "parent": "ubcpublications"
                        },
                        "ubysseynews": {
                            "nick": "ubysseynews",
                            "title": "Ubyssey",
                            "viz": 0,
                            "parent": "ubcpublications"
                        }
                    },
                    "cols": {
                        "298": {
                            "nick": "298",
                            "title": "Microstructure Engineering",
                            "viz": 1
                        },
                        "304": {
                            "nick": "304",
                            "title": "CHER Research Papers",
                            "viz": 1
                        },
                        "310": {
                            "nick": "310",
                            "title": "SCARP Graduating Projects",
                            "viz": 1
                        },
                        "340": {
                            "nick": "340",
                            "title": "Seismic Laboratory for Imaging and Modeling",
                            "viz": 1
                        },
                        "441": {
                            "nick": "441",
                            "title": "UBC Press Catalogues",
                            "viz": 1
                        },
                        "494": {
                            "nick": "494",
                            "title": "Library Staff Papers and Presentations",
                            "viz": 1
                        },
                        "536": {
                            "nick": "536",
                            "title": "Multidisciplinary Undergraduate Research Conference (MURC), 2008",
                            "viz": 1
                        },
                        "538": {
                            "nick": "538",
                            "title": "Physics Podcasts",
                            "viz": 1
                        },
                        "547": {
                            "nick": "547",
                            "title": "Physics & Astronomy Undergraduate Honours Theses",
                            "viz": 1
                        },
                        "594": {
                            "nick": "594",
                            "title": "Scientia Silvica Extension Series ",
                            "viz": 1
                        },
                        "641": {
                            "nick": "641",
                            "title": "UBC Press Book Supplements",
                            "viz": 1
                        },
                        "801": {
                            "nick": "801",
                            "title": "Vogt Symposium",
                            "viz": 1
                        },
                        "858": {
                            "nick": "858",
                            "title": "SLAIS Faculty",
                            "viz": 1
                        },
                        "947": {
                            "nick": "947",
                            "title": "Fisheries Centre Reports [Annual]",
                            "viz": 1
                        },
                        "948": {
                            "nick": "948",
                            "title": "CHER Theses and Dissertations",
                            "viz": 1
                        },
                        "990": {
                            "nick": "990",
                            "title": "Metropolis BC Policy Research Symposium, May 15, 2008",
                            "viz": 1
                        },
                        "1022": {
                            "nick": "1022",
                            "title": "6th International Conference on Gas Hydrates",
                            "viz": 1
                        },
                        "1037": {
                            "nick": "1037",
                            "title": "FRST 497",
                            "viz": 1
                        },
                        "1038": {
                            "nick": "1038",
                            "title": "FRST 499",
                            "viz": 1
                        },
                        "1039": {
                            "nick": "1039",
                            "title": "FRST 498",
                            "viz": 1
                        },
                        "1041": {
                            "nick": "1041",
                            "title": "CONS 498",
                            "viz": 1
                        },
                        "1042": {
                            "nick": "1042",
                            "title": "WOOD 493",
                            "viz": 1
                        },
                        "1077": {
                            "nick": "1077",
                            "title": "frontier, issue 4, June 2008",
                            "viz": 1
                        },
                        "1078": {
                            "nick": "1078",
                            "title": "Earth, Ocean and Atmospheric Sciences Undergraduate Honours Theses",
                            "viz": 1
                        },
                        "1151": {
                            "nick": "1151",
                            "title": "Skylight Publications and Reports",
                            "viz": 1
                        },
                        "1309": {
                            "nick": "1309",
                            "title": "frontier, issue 3, November 2007",
                            "viz": 1
                        },
                        "1312": {
                            "nick": "1312",
                            "title": "frontier, issue 2, December 2006",
                            "viz": 1
                        },
                        "1314": {
                            "nick": "1314",
                            "title": "frontier, issue 1, May 2006",
                            "viz": 1
                        },
                        "1423": {
                            "nick": "1423",
                            "title": "SCARP Faculty Research and Publications",
                            "viz": 1
                        },
                        "1426": {
                            "nick": "1426",
                            "title": "SCARP Course Projects",
                            "viz": 1
                        },
                        "2689": {
                            "nick": "2689",
                            "title": "Library Events",
                            "viz": 1
                        },
                        "2753": {
                            "nick": "2753",
                            "title": "frontier, issue 5, Fall/Winter 2008",
                            "viz": 1
                        },
                        "2754": {
                            "nick": "2754",
                            "title": "Library  Teaching Tools",
                            "viz": 1
                        },
                        "2765": {
                            "nick": "2765",
                            "title": "Midwifery Graduating Essays",
                            "viz": 1
                        },
                        "4189": {
                            "nick": "4189",
                            "title": "Congress 2008",
                            "viz": 1
                        },
                        "4915": {
                            "nick": "4915",
                            "title": "SLC 2009",
                            "viz": 1
                        },
                        "5744": {
                            "nick": "5744",
                            "title": "Multidisciplinary Undergraduate Research Conference (MURC), 2009",
                            "viz": 1
                        },
                        "6928": {
                            "nick": "6928",
                            "title": "Science One Research Projects 2008-2009",
                            "viz": 1
                        },
                        "7298": {
                            "nick": "7298",
                            "title": "Occupational Therapy Presentations",
                            "viz": 1
                        },
                        "7410": {
                            "nick": "7410",
                            "title": "Engineering Physics Projects",
                            "viz": 1
                        },
                        "7977": {
                            "nick": "7977",
                            "title": "History Honours Essays",
                            "viz": 1
                        },
                        "8073": {
                            "nick": "8073",
                            "title": "SCARP Independent Work",
                            "viz": 1
                        },
                        "8074": {
                            "nick": "8074",
                            "title": "APS Northwest Section 11th Annual Meeting",
                            "viz": 1
                        },
                        "8689": {
                            "nick": "8689",
                            "title": "Presentations, VP Students Office",
                            "viz": 1
                        },
                        "8865": {
                            "nick": "8865",
                            "title": "Computer Science Faculty Publications and Reports",
                            "viz": 1
                        },
                        "8930": {
                            "nick": "8930",
                            "title": "frontier, issue 6, Spring/Summer 2009",
                            "viz": 1
                        },
                        "9420": {
                            "nick": "9420",
                            "title": "English Faculty Publications",
                            "viz": 1
                        },
                        "11568": {
                            "nick": "11568",
                            "title": "Asian Library: Articles/Publications",
                            "viz": 1
                        },
                        "11569": {
                            "nick": "11569",
                            "title": "Asian Library: Audiovisual Records",
                            "viz": 1
                        },
                        "11570": {
                            "nick": "11570",
                            "title": "Asian Library: News Articles",
                            "viz": 1
                        },
                        "11571": {
                            "nick": "11571",
                            "title": "Asian Library: Miscellaneous",
                            "viz": 1
                        },
                        "12674": {
                            "nick": "12674",
                            "title": "MPT Systematic Reviews and Research Projects",
                            "viz": 1
                        },
                        "12708": {
                            "nick": "12708",
                            "title": "Vancouver Institute Lectures",
                            "viz": 1
                        },
                        "13138": {
                            "nick": "13138",
                            "title": "Politics, Memory, and Dissent: May Fourth, June Fourth & Beyond",
                            "viz": 1
                        },
                        "13139": {
                            "nick": "13139",
                            "title": "Annual Forestry Lecture in Sustainability",
                            "viz": 1
                        },
                        "13706": {
                            "nick": "13706",
                            "title": "GEOG 362: Geography of Economic Development",
                            "viz": 1
                        },
                        "13806": {
                            "nick": "13806",
                            "title": "NEXUS Spring Institute",
                            "viz": 1
                        },
                        "13807": {
                            "nick": "13807",
                            "title": "NEXUS Seminar Series",
                            "viz": 1
                        },
                        "13808": {
                            "nick": "13808",
                            "title": "NEXUS Portal Newsletters",
                            "viz": 1
                        },
                        "13809": {
                            "nick": "13809",
                            "title": "NEXUS Annual Reports",
                            "viz": 1
                        },
                        "13810": {
                            "nick": "13810",
                            "title": "NEXUS Other Knowledge Exchange",
                            "viz": 1
                        },
                        "13917": {
                            "nick": "13917",
                            "title": "Science Interdisciplinary Coursework",
                            "viz": 1
                        },
                        "13918": {
                            "nick": "13918",
                            "title": "Arts Interdisciplinary Coursework",
                            "viz": 1
                        },
                        "14850": {
                            "nick": "14850",
                            "title": "frontier, issue 7, Fall/Winter 2009",
                            "viz": 1
                        },
                        "14857": {
                            "nick": "14857",
                            "title": "Civil Engineering Faculty Publications",
                            "viz": 1
                        },
                        "15810": {
                            "nick": "15810",
                            "title": "Social Work Student Major Papers",
                            "viz": 1
                        },
                        "16648": {
                            "nick": "16648",
                            "title": "St. Mark's College Major Research Papers",
                            "viz": 1
                        },
                        "17990": {
                            "nick": "17990",
                            "title": "Asian Studies Undergraduate Papers",
                            "viz": 1
                        },
                        "18828": {
                            "nick": "18828",
                            "title": "Anthropology Faculty Research",
                            "viz": 1
                        },
                        "18836": {
                            "nick": "18836",
                            "title": "Cedar Mesa Project",
                            "viz": 1
                        },
                        "18861": {
                            "nick": "18861",
                            "title": "UBC Social Ecological Economic Development Studies (SEEDS) Student Reports",
                            "viz": 1
                        },
                        "19749": {
                            "nick": "19749",
                            "title": "Mathematics Faculty Publications and Reports",
                            "viz": 1
                        },
                        "21391": {
                            "nick": "21391",
                            "title": "Beyond the Centre: Newsletters of the CWGS",
                            "viz": 1
                        },
                        "21541": {
                            "nick": "21541",
                            "title": "UBC Press Publications",
                            "viz": 1
                        },
                        "21743": {
                            "nick": "21743",
                            "title": "Multidisciplinary Undergraduate Research Conference (MURC), 2010",
                            "viz": 1
                        },
                        "21986": {
                            "nick": "21986",
                            "title": "Asian Edge",
                            "viz": 1
                        },
                        "23302": {
                            "nick": "23302",
                            "title": "Library Assessment: Statistics",
                            "viz": 1
                        },
                        "23303": {
                            "nick": "23303",
                            "title": "Library Assessment: Publications/Presentations",
                            "viz": 1
                        },
                        "23304": {
                            "nick": "23304",
                            "title": "Library Assessment: LibQUAL Surveys",
                            "viz": 1
                        },
                        "23326": {
                            "nick": "23326",
                            "title": "Electrical and Computer Engineering Undergraduate Thesis",
                            "viz": 1
                        },
                        "23361": {
                            "nick": "23361",
                            "title": "Book Reviews: Asia General",
                            "viz": 1
                        },
                        "23362": {
                            "nick": "23362",
                            "title": "Book Reviews: China and Inner Asia",
                            "viz": 1
                        },
                        "23363": {
                            "nick": "23363",
                            "title": "Book Reviews: Northeast Asia",
                            "viz": 1
                        },
                        "23364": {
                            "nick": "23364",
                            "title": "Book Reviews: South Asia",
                            "viz": 1
                        },
                        "23365": {
                            "nick": "23365",
                            "title": "Book Reviews: Southeast Asia",
                            "viz": 1
                        },
                        "23366": {
                            "nick": "23366",
                            "title": "Book Reviews: Australasia and the Pacific Region",
                            "viz": 1
                        },
                        "23509": {
                            "nick": "23509",
                            "title": "ASTU400J: Knowledge and Power in International Relations",
                            "viz": 1
                        },
                        "23514": {
                            "nick": "23514",
                            "title": "CWGS Students",
                            "viz": 1
                        },
                        "23553": {
                            "nick": "23553",
                            "title": "Library Research Reports",
                            "viz": 1
                        },
                        "24062": {
                            "nick": "24062",
                            "title": "BCRLG Lecture Series",
                            "viz": 1
                        },
                        "24465": {
                            "nick": "24465",
                            "title": "Environmental Science Undergraduate Research Papers and Reports",
                            "viz": 1
                        },
                        "24571": {
                            "nick": "24571",
                            "title": "Science One Research Projects 2009-2010",
                            "viz": 1
                        },
                        "24886": {
                            "nick": "24886",
                            "title": "Nursing Students Major Essays and Projects",
                            "viz": 1
                        },
                        "24887": {
                            "nick": "24887",
                            "title": "Nursing Faculty Publications and Reports",
                            "viz": 1
                        },
                        "25332": {
                            "nick": "25332",
                            "title": "UBC Authors and Their Works Program, 1991-2006",
                            "viz": 1
                        },
                        "25805": {
                            "nick": "25805",
                            "title": "Speeches & Writing by UBC President Stephen J. Toope",
                            "viz": 1
                        },
                        "26494": {
                            "nick": "26494",
                            "title": "Faculty Development Publications (Medicine)",
                            "viz": 1
                        },
                        "26856": {
                            "nick": "26856",
                            "title": "CWGS Lecture Series: Podcasts and Notes",
                            "viz": 1
                        },
                        "26857": {
                            "nick": "26857",
                            "title": "CWGS Graduate Student Conference: podcasts",
                            "viz": 1
                        },
                        "26876": {
                            "nick": "26876",
                            "title": "Software Engineering Technical Reports",
                            "viz": 1
                        },
                        "26952": {
                            "nick": "26952",
                            "title": "Electrical Engineering Faculty Research",
                            "viz": 1
                        },
                        "26989": {
                            "nick": "26989",
                            "title": "School of Engineering Faculty Publications (Okanagan Campus)",
                            "viz": 1
                        },
                        "27306": {
                            "nick": "27306",
                            "title": "Irving K. Barber Learning Centre Events",
                            "viz": 1
                        },
                        "29050": {
                            "nick": "29050",
                            "title": "Anthropology Honours Theses (LoA)",
                            "viz": 1
                        },
                        "29055": {
                            "nick": "29055",
                            "title": "10th Canadian Summer School on Quantum Information",
                            "viz": 1
                        },
                        "29912": {
                            "nick": "29912",
                            "title": "Xwi7xwa Library: Publications",
                            "viz": 1
                        },
                        "29962": {
                            "nick": "29962",
                            "title": "Xwi7xwa Library: Indigenous Librarianship / Indigenous Knowledge Organization",
                            "viz": 1
                        },
                        "29986": {
                            "nick": "29986",
                            "title": "Workshop on Quantum Algorithms, Computational Models and Foundations of Quantum Mechanics",
                            "viz": 1
                        },
                        "30410": {
                            "nick": "30410",
                            "title": "Museum of Anthropology (MOA) Staff and Faculty Research",
                            "viz": 1
                        },
                        "31775": {
                            "nick": "31775",
                            "title": "UBC Historical Sound and Moving Image Collection",
                            "viz": 1
                        },
                        "31776": {
                            "nick": "31776",
                            "title": "UBC Faculty Publications Lists (1928-1969)",
                            "viz": 1
                        },
                        "32457": {
                            "nick": "32457",
                            "title": "SLAIS Research Days",
                            "viz": 1
                        },
                        "32536": {
                            "nick": "32536",
                            "title": "Atmospheric Science Program",
                            "viz": 1
                        },
                        "32618": {
                            "nick": "32618",
                            "title": "Xwi7xwa Library: Aboriginal Education",
                            "viz": 1
                        },
                        "33066": {
                            "nick": "33066",
                            "title": "Perspectives Newspaper",
                            "viz": 1
                        },
                        "33067": {
                            "nick": "33067",
                            "title": "Chinese Canadian Stories media",
                            "viz": 1
                        },
                        "33359": {
                            "nick": "33359",
                            "title": "Faculty of Medicine: General Faculty Papers",
                            "viz": 1
                        },
                        "33381": {
                            "nick": "33381",
                            "title": "cIRcle License Text",
                            "viz": 1
                        },
                        "33426": {
                            "nick": "33426",
                            "title": "Supplementary Thesis Materials and Errata",
                            "viz": 1
                        },
                        "33755": {
                            "nick": "33755",
                            "title": "UBC Law Special Lectures",
                            "viz": 1
                        },
                        "33850": {
                            "nick": "33850",
                            "title": "Award: UBC Library Innovative Dissemination of Research Award",
                            "viz": 1
                        },
                        "34125": {
                            "nick": "34125",
                            "title": "GEOG 419: Research in Environmental Geography",
                            "viz": 1
                        },
                        "34295": {
                            "nick": "34295",
                            "title": "Explorations and Education",
                            "viz": 1
                        },
                        "34788": {
                            "nick": "34788",
                            "title": "Science One Research Projects 2010-2011",
                            "viz": 1
                        },
                        "34910": {
                            "nick": "34910",
                            "title": "SPIE Publications (Electrical and Computer Engineering)",
                            "viz": 1
                        },
                        "35034": {
                            "nick": "35034",
                            "title": "Frontotemporal Dementia (FTD) Research Group Papers",
                            "viz": 1
                        },
                        "35080": {
                            "nick": "35080",
                            "title": "Investigating Our Practices",
                            "viz": 1
                        },
                        "35980": {
                            "nick": "35980",
                            "title": "SLAIS Students",
                            "viz": 1
                        },
                        "36347": {
                            "nick": "36347",
                            "title": "History Faculty Research",
                            "viz": 1
                        },
                        "36392": {
                            "nick": "36392",
                            "title": "Forestry Faculty Publications",
                            "viz": 1
                        },
                        "36393": {
                            "nick": "36393",
                            "title": "Forestry Annual Reports",
                            "viz": 1
                        },
                        "36394": {
                            "nick": "36394",
                            "title": "Branchlines",
                            "viz": 1
                        },
                        "36467": {
                            "nick": "36467",
                            "title": "EDST Student Graduating Papers",
                            "viz": 1
                        },
                        "36877": {
                            "nick": "36877",
                            "title": "EDCP Home Economics: Human Ecology and Everyday Life (HEEL)",
                            "viz": 1
                        },
                        "36883": {
                            "nick": "36883",
                            "title": "SPIE Publications (Physics &  Astronomy)",
                            "viz": 1
                        },
                        "37052": {
                            "nick": "37052",
                            "title": "Fisheries Centre Research Reports",
                            "viz": 1
                        },
                        "37211": {
                            "nick": "37211",
                            "title": "Tailings and Mine Waste 2011: Vancouver, Canada",
                            "viz": 1
                        },
                        "37212": {
                            "nick": "37212",
                            "title": "Earth, Ocean and Atmospheric Sciences Faculty Research",
                            "viz": 1
                        },
                        "37859": {
                            "nick": "37859",
                            "title": "SBE Division Teaching Notes",
                            "viz": 1
                        },
                        "37865": {
                            "nick": "37865",
                            "title": "SBE Division Working Papers",
                            "viz": 1
                        },
                        "38108": {
                            "nick": "38108",
                            "title": "Mazatan Project, Chiapas, Mexico",
                            "viz": 1
                        },
                        "38316": {
                            "nick": "38316",
                            "title": "Analytical Geochemistry",
                            "viz": 1
                        },
                        "38318": {
                            "nick": "38318",
                            "title": "High-temperature Geochemistry",
                            "viz": 1
                        },
                        "38319": {
                            "nick": "38319",
                            "title": "Low-temperature Geochemistry",
                            "viz": 1
                        },
                        "38422": {
                            "nick": "38422",
                            "title": "Mechanical Engineering Faculty Publications",
                            "viz": 1
                        },
                        "39137": {
                            "nick": "39137",
                            "title": "MAAPPS Practicum Reports",
                            "viz": 1
                        },
                        "39339": {
                            "nick": "39339",
                            "title": "Philosophy Faculty Research",
                            "viz": 1
                        },
                        "39440": {
                            "nick": "39440",
                            "title": "Green College Webcasts",
                            "viz": 1
                        },
                        "39478": {
                            "nick": "39478",
                            "title": "Asian Studies Faculty Research",
                            "viz": 1
                        },
                        "40947": {
                            "nick": "40947",
                            "title": "Graduate Law Students' Conference Publications",
                            "viz": 1
                        },
                        "41082": {
                            "nick": "41082",
                            "title": "Science One Research Projects 2011-2012",
                            "viz": 1
                        },
                        "41119": {
                            "nick": "41119",
                            "title": "Sea Around Us Project Newsletter",
                            "viz": 1
                        },
                        "41223": {
                            "nick": "41223",
                            "title": "EDST Special Lectures & Faculty Publications",
                            "viz": 1
                        },
                        "41228": {
                            "nick": "41228",
                            "title": "Public Health, Emerging Threats & Rapid Response",
                            "viz": 1
                        },
                        "41328": {
                            "nick": "41328",
                            "title": "Fraser Valley Archaeological Project, BC, Canada",
                            "viz": 1
                        },
                        "41792": {
                            "nick": "41792",
                            "title": "UBC Nursing Student Journal (UBC-NSJ), 2012",
                            "viz": 1
                        },
                        "41978": {
                            "nick": "41978",
                            "title": "Remote Sensing Methods",
                            "viz": 1
                        },
                        "42020": {
                            "nick": "42020",
                            "title": "RBSC:  Audiovisual Records",
                            "viz": 1
                        },
                        "42387": {
                            "nick": "42387",
                            "title": "Geography Faculty Publications and Reports",
                            "viz": 1
                        },
                        "42446": {
                            "nick": "42446",
                            "title": "Multidisciplinary Undergraduate Research Conference (MURC), 2012+",
                            "viz": 1
                        },
                        "42486": {
                            "nick": "42486",
                            "title": "English Undergraduate Honours Essays (Okanagan Campus)",
                            "viz": 1
                        },
                        "42487": {
                            "nick": "42487",
                            "title": "Master of Science in Nursing (MSN) Scholarly Projects (Okanagan Campus)",
                            "viz": 1
                        },
                        "42488": {
                            "nick": "42488",
                            "title": "School of Nursing Faculty Publications (Okanagan Campus)",
                            "viz": 1
                        },
                        "42493": {
                            "nick": "42493",
                            "title": "Chemistry Undergraduate Honours Essays (Okanagan Campus)",
                            "viz": 1
                        },
                        "42494": {
                            "nick": "42494",
                            "title": "History Undergraduate Honours Theses, Projects, Essays (Okanagan Campus)",
                            "viz": 1
                        },
                        "42495": {
                            "nick": "42495",
                            "title": "Undergraduate Student Course Work, IKBSAS (Okanagan Campus)",
                            "viz": 1
                        },
                        "42496": {
                            "nick": "42496",
                            "title": "Psychology Undergraduate Honours Essays (Okanagan Campus)",
                            "viz": 1
                        },
                        "42497": {
                            "nick": "42497",
                            "title": "Computer Science Undergraduate Honours Essays (Okanagan Campus)",
                            "viz": 1
                        },
                        "42543": {
                            "nick": "42543",
                            "title": "Biology Program",
                            "viz": 1
                        },
                        "42591": {
                            "nick": "42591",
                            "title": "GSS cIRcle Open Scholar Award (UBCV Non-Thesis Graduate Work)",
                            "viz": 1
                        },
                        "43377": {
                            "nick": "43377",
                            "title": "UBC Japanese Canadian Students of 1942",
                            "viz": 1
                        },
                        "43391": {
                            "nick": "43391",
                            "title": "WCILCOS 2012: The 5th International Conference of Institutes and Libraries for Chinese Overseas Studies",
                            "viz": 1
                        },
                        "43418": {
                            "nick": "43418",
                            "title": "Faculty of Creative and Critical Studies Faculty Publications (Okanagan Campus)",
                            "viz": 1
                        },
                        "43600": {
                            "nick": "43600",
                            "title": "Family Practice Faculty Research",
                            "viz": 1
                        },
                        "43796": {
                            "nick": "43796",
                            "title": "KIN Research Papers",
                            "viz": 1
                        },
                        "43962": {
                            "nick": "43962",
                            "title": "Verna J. Kirkness - Speeches",
                            "viz": 1
                        },
                        "44121": {
                            "nick": "44121",
                            "title": "English Student Papers",
                            "viz": 1
                        },
                        "44311": {
                            "nick": "44311",
                            "title": "Xwi7xwa Library: First Nations House of Learning Collections",
                            "viz": 1
                        },
                        "44376": {
                            "nick": "44376",
                            "title": "Economics Faculty Research",
                            "viz": 1
                        },
                        "44377": {
                            "nick": "44377",
                            "title": "GEOG 429: Research in Historical Geography",
                            "viz": 1
                        },
                        "44392": {
                            "nick": "44392",
                            "title": "Science One Research Projects 2012-2013",
                            "viz": 1
                        },
                        "44550": {
                            "nick": "44550",
                            "title": "Central, Eastern, Northern European Studies (CENES) Faculty Research Publications",
                            "viz": 1
                        },
                        "44632": {
                            "nick": "44632",
                            "title": "EDCP Student Graduating Papers",
                            "viz": 1
                        },
                        "44661": {
                            "nick": "44661",
                            "title": "Selected Retrospective Forestry Undergraduate Theses and Essays (pre-2009)",
                            "viz": 1
                        },
                        "45088": {
                            "nick": "45088",
                            "title": "EDCP Research Papers",
                            "viz": 1
                        },
                        "45132": {
                            "nick": "45132",
                            "title": "UBC Nursing Student Journal (UBC-NSJ), 2013",
                            "viz": 1
                        },
                        "45195": {
                            "nick": "45195",
                            "title": "Rheumatology Newsletters",
                            "viz": 1
                        },
                        "45204": {
                            "nick": "45204",
                            "title": "Screens in Vancouver: Cinemagoing and the City in 1914",
                            "viz": 1
                        },
                        "45422": {
                            "nick": "45422",
                            "title": "Business Families Centre's White Paper Series: Research Matters",
                            "viz": 1
                        },
                        "45447": {
                            "nick": "45447",
                            "title": "Law Faculty Research",
                            "viz": 1
                        },
                        "45539": {
                            "nick": "45539",
                            "title": "LLED Student Research",
                            "viz": 1
                        },
                        "45578": {
                            "nick": "45578",
                            "title": "High-Throughput Biology (CHiBi) Research, Centre for",
                            "viz": 1
                        },
                        "45960": {
                            "nick": "45960",
                            "title": "UBC Community Engagement Projects",
                            "viz": 1
                        },
                        "46074": {
                            "nick": "46074",
                            "title": "Physics and Astronomy Faculty Publications and Reports",
                            "viz": 1
                        },
                        "46280": {
                            "nick": "46280",
                            "title": "Vancouver School of Theology Theses",
                            "viz": 1
                        },
                        "46343": {
                            "nick": "46343",
                            "title": "Adam Jones Global Photo Archive",
                            "viz": 1
                        },
                        "46601": {
                            "nick": "46601",
                            "title": "Sociology Undergraduate Honours Theses",
                            "viz": 1
                        },
                        "46624": {
                            "nick": "46624",
                            "title": "Consortium for Nursing History Inquiry",
                            "viz": 1
                        },
                        "46718": {
                            "nick": "46718",
                            "title": "PIMS Newsletter",
                            "viz": 1
                        },
                        "46721": {
                            "nick": "46721",
                            "title": "PIMS Year in Review",
                            "viz": 1
                        },
                        "46976": {
                            "nick": "46976",
                            "title": "Symposium on Early Modern Japanese Values and Individuality",
                            "viz": 1
                        },
                        "47057": {
                            "nick": "47057",
                            "title": "Linguistics Undergraduate Honours Theses",
                            "viz": 1
                        },
                        "47136": {
                            "nick": "47136",
                            "title": "CHSPR Publications",
                            "viz": 1
                        },
                        "48368": {
                            "nick": "48368",
                            "title": "Low Carbon Economy",
                            "viz": 1
                        },
                        "48441": {
                            "nick": "48441",
                            "title": "LLED Student Graduating Papers",
                            "viz": 1
                        },
                        "48503": {
                            "nick": "48503",
                            "title": "Health Human Resources Unit (HHRU) [1973-2002]",
                            "viz": 1
                        },
                        "48504": {
                            "nick": "48504",
                            "title": "British Columbia Office of Health Technology Assessment (BCOHTA) [1990-2002]",
                            "viz": 1
                        },
                        "48630": {
                            "nick": "48630",
                            "title": "BIRS Workshop Lecture Videos",
                            "viz": 1
                        },
                        "50126": {
                            "nick": "50126",
                            "title": "CUER Papers and Reports",
                            "viz": 1
                        },
                        "50252": {
                            "nick": "50252",
                            "title": "Health and Wellness",
                            "viz": 1
                        },
                        "50356": {
                            "nick": "50356",
                            "title": "Mathematics Undergraduate Student Research",
                            "viz": 1
                        },
                        "50555": {
                            "nick": "50555",
                            "title": "Leader in Residence",
                            "viz": 1
                        },
                        "50687": {
                            "nick": "50687",
                            "title": "Archaeological Site Reports",
                            "viz": 1
                        },
                        "51184": {
                            "nick": "51184",
                            "title": "Centre for Sustainable Food Systems at UBC Farm Research",
                            "viz": 1
                        },
                        "51368": {
                            "nick": "51368",
                            "title": "Insights from NMR : A symposium in honour of Myer Bloom",
                            "viz": 1
                        },
                        "51832": {
                            "nick": "51832",
                            "title": "TRIUMF Technical Reports",
                            "viz": 1
                        },
                        "51833": {
                            "nick": "51833",
                            "title": "TRIUMF Annual Reports",
                            "viz": 1
                        },
                        "51869": {
                            "nick": "51869",
                            "title": "Science One Research Projects 2014+",
                            "viz": 1
                        },
                        "51871": {
                            "nick": "51871",
                            "title": "Physical Therapy Faculty Research and Publications",
                            "viz": 1
                        },
                        "52383": {
                            "nick": "52383",
                            "title": "Faculty Research and Publications",
                            "viz": 1
                        },
                        "52387": {
                            "nick": "52387",
                            "title": "UBC Community and Partner Publications",
                            "viz": 1
                        },
                        "52657": {
                            "nick": "52657",
                            "title": "EESD15 – The Seventh International Conference on Engineering Education for Sustainable Development",
                            "viz": 1
                        },
                        "52660": {
                            "nick": "52660",
                            "title": "ICSC15 – The Canadian Society for Civil Engineering’s 5th International/11th Construction Specialty Conference",
                            "viz": 1
                        },
                        "52966": {
                            "nick": "52966",
                            "title": "Undergraduate Research",
                            "viz": 1
                        },
                        "53032": {
                            "nick": "53032",
                            "title": "ICASP12 – 12th International Conference on Applications of Statistics and Probability in Civil Engineering",
                            "viz": 1
                        },
                        "53169": {
                            "nick": "53169",
                            "title": "UBC President's Speeches and Writings",
                            "viz": 1
                        },
                        "53926": {
                            "nick": "53926",
                            "title": "The 2015 International Conference on Health Promoting Universities and Colleges/VII International Congress",
                            "viz": 1
                        },
                        "55474": {
                            "nick": "55474",
                            "title": "Digital Library Federation (DLF)",
                            "viz": 1
                        },
                        "hundred": {
                            "nick": "hundred",
                            "title": "One Hundred Poets",
                            "viz": 1
                        },
                        "focus": {
                            "nick": "focus",
                            "title": "FOCUS",
                            "viz": 1
                        },
                        "biblos": {
                            "nick": "biblos",
                            "title": "University Publications - Biblos",
                            "viz": 1
                        },
                        "creelman": {
                            "nick": "creelman",
                            "title": "Lyle Creelman Fonds",
                            "viz": 1
                        },
                        "asian": {
                            "nick": "asian",
                            "title": "UBC Asian Library Rare Book Collection",
                            "viz": 1
                        },
                        "ecrosby": {
                            "nick": "ecrosby",
                            "title": "Emma Crosby Letters",
                            "viz": 1
                        },
                        "arphotos": {
                            "nick": "arphotos",
                            "title": "UBC Archives Photograph Collection",
                            "viz": 1
                        },
                        "tokugawa": {
                            "nick": "tokugawa",
                            "title": "Japanese Maps of the Tokugawa Era",
                            "viz": 1
                        },
                        "yipsang": {
                            "nick": "yipsang",
                            "title": "Yip Sang Collection",
                            "viz": 1
                        },
                        "manuscripts": {
                            "nick": "manuscripts",
                            "title": "Western Manuscripts",
                            "viz": 1
                        },
                        "alumchron": {
                            "nick": "alumchron",
                            "title": "UBC Alumni Chronicle",
                            "viz": 1
                        },
                        "calendars": {
                            "nick": "calendars",
                            "title": "UBC Calendars",
                            "viz": 1
                        },
                        "berkpost": {
                            "nick": "berkpost",
                            "title": "Berkeley 1968-1973 poster collection",
                            "viz": 1
                        },
                        "first100theses": {
                            "nick": "first100theses",
                            "title": "First Hundred Theses",
                            "viz": 1
                        },
                        "royalfisk": {
                            "nick": "royalfisk",
                            "title": "Royal Fisk Gold Rush Letters",
                            "viz": 1
                        },
                        "davidconde": {
                            "nick": "davidconde",
                            "title": "David Conde Fonds",
                            "viz": 1
                        },
                        "ubclsb": {
                            "nick": "ubclsb",
                            "title": "University Publications - UBC Library Staff Bulletin",
                            "viz": 1
                        },
                        "bcsessional": {
                            "nick": "bcsessional",
                            "title": "BC Sessional Papers",
                            "viz": 1
                        },
                        "ubclsmm": {
                            "nick": "ubclsmm",
                            "title": "University Publications - UBC Library Staff Meeting Minutes",
                            "viz": 1
                        },
                        "ohs": {
                            "nick": "ohs",
                            "title": "Okanagan Historical Society Reports",
                            "viz": 1
                        },
                        "chungosgr": {
                            "nick": "chungosgr",
                            "title": "Chung Oversize and Graphic Materials",
                            "viz": 1
                        },
                        "dorothyburn": {
                            "nick": "dorothyburn",
                            "title": "Dorothy Burnett Bookbinding Tools",
                            "viz": 1
                        },
                        "citraudio": {
                            "nick": "citraudio",
                            "title": "CiTR Audio Tapes",
                            "viz": 1
                        },
                        "prism": {
                            "nick": "prism",
                            "title": "PRISM international",
                            "viz": 1
                        },
                        "ubcavfrc": {
                            "nick": "ubcavfrc",
                            "title": "UBC Legacy Video Collection",
                            "viz": 1
                        },
                        "fisheries": {
                            "nick": "fisheries",
                            "title": "UBC Institute of Fisheries Field Records",
                            "viz": 1
                        },
                        "rosetti": {
                            "nick": "rosetti",
                            "title": "Rosetti Studios - Stanley Park Collection",
                            "viz": 1
                        },
                        "arkley": {
                            "nick": "arkley",
                            "title": "Tremaine Arkley Croquet Collection",
                            "viz": 1
                        },
                        "gvrdmaps": {
                            "nick": "gvrdmaps",
                            "title": "Greater Vancouver Regional District Planning Department Land Use Maps",
                            "viz": 1
                        },
                        "squeezes": {
                            "nick": "squeezes",
                            "title": "Epigraphic Squeezes",
                            "viz": 1
                        },
                        "archivesav": {
                            "nick": "archivesav",
                            "title": "UBC Archives Audio Recordings Collection",
                            "viz": 1
                        },
                        "vma": {
                            "nick": "vma",
                            "title": "Vancouver Medical Association",
                            "viz": 1
                        },
                        "fisherman": {
                            "nick": "fisherman",
                            "title": "Fisherman Publishing Society Collection",
                            "viz": 1
                        },
                        "darwin": {
                            "nick": "darwin",
                            "title": "Charles Darwin letters",
                            "viz": 1
                        },
                        "goldenera": {
                            "nick": "goldenera",
                            "title": "Newspapers - Golden Era",
                            "viz": 1
                        },
                        "delgamuukw": {
                            "nick": "delgamuukw",
                            "title": "Delgamuukw Trial Transcripts",
                            "viz": 1
                        },
                        "davidsonia": {
                            "nick": "davidsonia",
                            "title": "Davidsonia",
                            "viz": 1
                        },
                        "feeders": {
                            "nick": "feeders",
                            "title": "Infant Feeders Collection",
                            "viz": 1
                        },
                        "johnkeenlyside": {
                            "nick": "johnkeenlyside",
                            "title": "John Keenlyside Legal Research Collection",
                            "viz": 1
                        },
                        "florence": {
                            "nick": "florence",
                            "title": "Florence Nightingale Letters",
                            "viz": 1
                        },
                        "saga": {
                            "nick": "saga",
                            "title": "SAGA Document Collection",
                            "viz": 1
                        },
                        "specialp": {
                            "nick": "specialp",
                            "title": "UBC Library Digitization Centre Special Projects",
                            "viz": 1
                        },
                        "artefacts": {
                            "nick": "artefacts",
                            "title": "Ancient Artefacts",
                            "viz": 1
                        },
                        "wwposters": {
                            "nick": "wwposters",
                            "title": "WWI & WWII Posters",
                            "viz": 1
                        },
                        "tgdp": {
                            "nick": "tgdp",
                            "title": "Traité général des pesches",
                            "viz": 1
                        },
                        "mccormick": {
                            "nick": "mccormick",
                            "title": "Andrew McCormick Maps and Prints",
                            "viz": 1
                        },
                        "langmann": {
                            "nick": "langmann",
                            "title": "Uno Langmann Family Collection of BC Photographs",
                            "viz": 1
                        },
                        "wwiphoto": {
                            "nick": "wwiphoto",
                            "title": "World War I British press photograph collection",
                            "viz": 1
                        },
                        "westland": {
                            "nick": "westland",
                            "title": "Westland",
                            "viz": 1
                        },
                        "macmillan": {
                            "nick": "macmillan",
                            "title": "MacMillan Bloedel Limited fonds",
                            "viz": 1
                        },
                        "kinesis": {
                            "nick": "kinesis",
                            "title": "Kinesis",
                            "viz": 1
                        },
                        "anderson": {
                            "nick": "anderson",
                            "title": "Peter Anderson fonds",
                            "viz": 1
                        },
                        "tairikunipp": {
                            "nick": "tairikunipp",
                            "title": "Tairiku Nippo (Continental Daily News)",
                            "viz": 1
                        },
                        "capilano": {
                            "nick": "capilano",
                            "title": "Capilano Timber Company fonds",
                            "viz": 1
                        },
                        "bch": {
                            "nick": "bch",
                            "title": "British Columbia History",
                            "viz": 1
                        },
                        "ubclibnews": {
                            "nick": "ubclibnews",
                            "title": "University Publications - UBC Library News",
                            "viz": 1
                        },
                        "mathison": {
                            "nick": "mathison",
                            "title": "R. Mathison Collection",
                            "viz": 1
                        },
                        "bullock": {
                            "nick": "bullock",
                            "title": "H. Bullock-Webster fonds",
                            "viz": 1
                        },
                        "touchpoints": {
                            "nick": "touchpoints",
                            "title": "Touchpoints",
                            "viz": 1
                        },
                        "jphotos": {
                            "nick": "jphotos",
                            "title": "Japanese Canadian Photograph Collection",
                            "viz": 1
                        },
                        "bookplate": {
                            "nick": "bookplate",
                            "title": "RBSC Bookplates",
                            "viz": 1
                        },
                        "columbiarev": {
                            "nick": "columbiarev",
                            "title": "Newspapers - Columbia Review",
                            "viz": 1
                        },
                        "framed": {
                            "nick": "framed",
                            "title": "UBC Library Framed Works Collection",
                            "viz": 1
                        },
                        "paccannw": {
                            "nick": "paccannw",
                            "title": "Newspapers - Pacific Canadian (New Westminster)",
                            "viz": 1
                        },
                        "slodrill": {
                            "nick": "slodrill",
                            "title": "Newspapers - Slocan Drill",
                            "viz": 1
                        },
                        "bcbooks": {
                            "nick": "bcbooks",
                            "title": "BC Historical Books",
                            "viz": 1
                        },
                        "evewoross": {
                            "nick": "evewoross",
                            "title": "Newspapers - Evening World (Rossland)",
                            "viz": 1
                        },
                        "princero": {
                            "nick": "princero",
                            "title": "Newspapers - Prince Rupert Optimist",
                            "viz": 1
                        },
                        "slorec": {
                            "nick": "slorec",
                            "title": "Newspapers - Slocan Record",
                            "viz": 1
                        },
                        "ubcrd": {
                            "nick": "ubcrd",
                            "title": "UBC Research Data",
                            "viz": 1
                        },
                        "discorder": {
                            "nick": "discorder",
                            "title": "Discorder",
                            "viz": 1
                        }
                    }
                }
            };
            function aggsSubsCols(){
                if(angular.equals({}, colsAndAggData)){
                    return $http({
                        method  : 'GET',
                        url     : website_base_url + '/ajax/get_col_and_agg_data',
                        cache   : true
                        }
                    ).success(function(response){
                        // console.log('get_col_and_agg_data', response);
                        colsAndAggData.data = response;
                        colTitles = makeTitlesLookup(response);
                        return response;
                    })
                    .error(function(error){
                        console.log('COLLECTIONS DB CALL ERROR', error);
                        return {};
                    });
                } else {
                    return $q.when(colsAndAggData);
                }
            }

            // make lookup list for showing the right collection title
            function makeTitlesLookup(d){

                var titles = {};
                // add normal collections
                for (var c in d.cols){
                    titles[c] = d.cols[c];
                }
                for (var s in d.sub_cols){
                    // mask invisible sub-collections under parent aggregate
                    if(d.sub_cols[s].viz === 0){
                        var parentNick = d.sub_cols[s].parent;
                        
                        titles[s] = {
                            nick: parentNick,
                            title: d.aggregates[parentNick].title
                        };
                    // add visible sub-collections
                    } else {
                         titles[s] = {
                            nick: d.sub_cols[s].nick,
                            title: d.sub_cols[s].title
                        };
                    }
                }
                // add aggregate collections
                for (var a in d.aggregates) {
                    titles[a] = {
                        nick: d.aggregates[a].nick,
                        title: d.aggregates[a].title
                    };
                }

               // console.log('makeTitlesLookup', d, titles);

               return titles;
            }

            // // get a single title
            var getTitle = function(nick){
                // console.log(nick, colTitles, colTitles[nick]);
                if(!angular.equals({}, colTitles)){
                    return $q.when( colTitles[nick]);
                } else {
                    return aggsSubsCols().then(function(response){
                        return colTitles[nick];
                    });
                }
            };
            // used in esSearch.js to resolve an array of nicks (agg and col) into an expanded csv of col nicks for ES
            var resolveAggs = function(nicks){
                var indices;
                 if(angular.equals({}, colsAndAggData)){
                    return aggsSubsCols().then(function(response){
                        return $q.when(makeIndices(nicks));
                    });
                } else {
                    return $q.when(makeIndices(nicks));
                }

                function makeIndices(nicks){
                    var arr = [];
                    for (var i=0; i < nicks.length; i++){
                        var nick = nicks[i];
                        var isAgg = false;
                        for( var agg in colsAndAggData.data.aggregates) {
                            if (nick === agg) {
                                var isAgg = true;
                                arr.push( colsAndAggData.data.aggregates[agg].csv );
                            } 
                        }
                        if(!isAgg) { arr.push(nick); }
                    }
                    return arr.join(',');
                }
            };

            return {
                getColsData : getColsData,
                getAdminColsData : getAdminColsData,
                getTopicsData : getTopicsData,
                getCircleCatsData: getCircleCatsData,
                getColData : getColData,
                makeColsList : makeColsList,
                makeColsListAdmin: makeColsListAdmin,
                save : save,
                getTitle : getTitle,
                aggsSubsCols : aggsSubsCols,
                resolveAggs : resolveAggs
                };
    }]);
});