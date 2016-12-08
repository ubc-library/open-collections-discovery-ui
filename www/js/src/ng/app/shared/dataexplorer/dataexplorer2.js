define(function (require){

    var templatePath = js_base_url + "ng/app/shared/dataexplorer/templates/";

    var angular = require('angular'),
        d3 = require('d3'),
        dlD3charts = require('d3onebar'),
        dlService = require('services/fieldService');

    var dataexplorer = angular.module('dataexplorer', ['dlServices', 'dlFilters', 'dlD3charts']);
    
    // controller
    dataexplorer.controller('dataexplorerCtrl', ['$scope', 'esSearchService', 'esSearchString', '$filter', 'fieldService', 'utility', '$http', '$templateCache', 'utility',
    function($scope, es, searchString, $filter, fieldService, utility, $http, $templateCache, utility) {

        // load and cache template up front
        $http.get(templatePath + 'explorer2.html?version='+app_version, { cache:$templateCache });
        
        fieldService.getFields().then(function(){
             init();
        });

        function init(){
            $scope.loading = true;
            var searchOpts = {};
            searchOpts.query = '*';

            // promise chain: 1) get fields 2) make search string 3) do search
            fieldService.getFields(['sortDate', 'type', 'subject']).then(function(response){
                // console.log(response);
                searchOpts.aggsObj = {
                        date_hist : {
                             date_histogram: {
                                 field   : response.sortDate.map,
                                 interval: "year",
                                 format  : "yyyy-MM-dd"
                             },
                         },
                       type      : {
                           terms: {
                               field: response.type.map + '.raw',
                               size : 60
                           },
                           aggregations: {
                                date_hist : {
                                    date_histogram: {
                                        field   : response.sortDate.map,
                                        interval: "year"
                                    }
                                }
                            }
                       },
                       subject   : {
                           terms: {
                               field: response.subject.map + '.raw',
                               size : 60
                           },
                           aggregations: {
                                date_hist : {
                                    date_histogram: {
                                        field   : response.sortDate.map,
                                        interval: "year"
                                    }
                                }
                            }
                       }
                };

                searchString.makeString(searchOpts).then(function(response){
                    // first search
                    es.search({
                        from: 0,
                        size: 0,
                        body: response,
                        searchIndex: colId,
                        search_type: 'count'
                    }).then(function(response){
                        $scope.exploreData = {
                            date: response.aggs,
                            subject: response.aggs.subject.buckets,
                            type: response.aggs.type.buckets
                        };

                        // console.log($scope.exploreData);

                        // add IDs to fields so i can find them easily, remove spurious dates
                        for (var prop in $scope.exploreData){
                            parseData(prop);
                         }
                        function parseData(field){
                            if ($scope.exploreData[field].date_hist){
                                $scope.exploreData[field].date_hist.buckets = utility.cleanDates($scope.exploreData[field].date_hist.buckets);
                            } else {
                                angular.forEach($scope.exploreData[field], function(d, i){
                                    d.id = field + i;
                                    if(d.date_hist) {
                                        d.date_hist.buckets = utility.cleanDates(d.date_hist.buckets);
                                    }
                                });
                            }
                        }
                        $scope.$broadcast('explorerDataReady');
                        $scope.loading = false;
                    });
                });
            });
        }

        // title for explorer graph
        $scope.xByYear = 'Total Items';

        function switchBroadcast(obj){
            $scope.$broadcast('switchData', obj);
            $scope.xByYear = obj.term;
        }

        $scope.switchToTotal = function(){
            switchBroadcast({
                term: 'Total Items',
                key: 'total',
                cl: 'bluebars'
            });
        };

        // execute functions passed up from D3 directives (oneBar in particular)
        $scope.passUp = function(obj){
            // console.log(obj);
            // switch data for bar graph view (trigger on one-bar hover)
            if(obj.act === 'switchData') { 
                switchBroadcast(obj);
                $scope.$apply();
            }
            if(obj.act === 'filter'){
                utility.gaEvent('data_explorer', 'filter', obj.key);
                toggleTerm(obj.key, obj.term);
                $scope.$apply();
            } if (obj.act === 'filterDate'){
                utility.gaEvent('data_explorer', 'filter', 'date_range');
                if (obj.key === 'nodate') {
                    $scope.filterDates = '';
                } else {
                    $scope.filterDates = obj;
                }
                $scope.$apply();
            } else { return; }
        };

        $scope.filterTerms = {
            subject : [],
            type : []
        };

        $scope.filterDates = '';

        $scope.isFiltered = function(){
            if($scope.filterDates) { return true; }
            for (var f in $scope.filterTerms){
                if( $scope.filterTerms[f].length > 0) {
                    return true;
                }
            }
            return false;
        };

        function toggleTerm(key, term){
            var index = $scope.filterTerms[key].indexOf(term);
            if (index === -1){     
                $scope.filterTerms[key].push(term);
                return true;
            } else {
                $scope.filterTerms[key].splice(index, 1);
                return false;
            }
        }

        $scope.unFilter = function(key, term){
            if(key === 'dates') { 
                $scope.filterDates = '';
            } else {
                toggleTerm(key,term);
            }
            var obj = {key: key, term: term};
            console.log('unfilter', obj);
            $scope.$broadcast('unfilter', obj);
        };

        // dates set by date range d3 brush selector, stored here
        $scope.dateSelection = {};
        
        // Search
        $scope.search = function(query){

            if(!query){ query = '*';}

            var url = '/search?q=';
            var limits = '&collection=' + colId;

            if ($scope.isFiltered()){
                utility.gaEvent('data_explorer', 'search', 'with_filters');
                // add date filter
                if($scope.filterDates){
                    limits += '&dBegin=' +  $scope.filterDates.begin.key + '&dEnd=' + $scope.filterDates.end.key;
                }
                // add category filters
                for( var t in $scope.filterTerms){
                    $scope.filterTerms[t].forEach(function(d){
                        limits += '&' + t + '=' + d;
                    });
                }
            } else {
                utility.gaEvent('data_explorer', 'search', 'no_filters');
            }
            window.location.href = encodeURI(url + query + limits);
        };

    }]);

    // parent directive (template)

    dataexplorer.directive('dataexplorer2', [ function() {
        function link(scope, element, attrs) {

        }
        return {
            restrict: 'EA',
            scope: '=',
            templateUrl: templatePath + 'explorer2.html?version='+app_version,
            controller: 'dataexplorerCtrl',
            link: link
        };
    }]);

    // the d3 chart

    dataexplorer.directive('explorerChart',['$window', 'esSearchString', '$timeout', function($window, searchString, $timeout){
    
        return {
            restrict: 'EA',
            scope: {
                data: '=',
                selection: '=',
                title: '@',
                passUp: '&'
            },
            link: function($scope, ele, attrs){

                var renderTimeout;

                var title = $scope.title;

                 var margin = {
                        top: parseInt(attrs.margin) || 12,
                        right: parseInt(attrs.margin) || 6,
                        bottom: parseInt(attrs.margin) || 30,
                        left: parseInt(attrs.margin) || 30,
                    },
                    // height = 260;
                    height = ele.parent().height() - 6;

                 var svg = d3.select(ele[0]).append('svg');

                 // console.log(ele);

                // render on data load

                $scope.$on('explorerDataReady', function(){
                    $scope.render($scope.$parent.exploreData);
                });

                // .. might not be the most efficient way to make this responsive, but work for now.
                // should make this directive not load at all on screens smaller than an ipad mini
                var winWidth = $(window).width();
                window.addEventListener("resize", function() {
                    var newWW = $(window).width();
                    $timeout(function(){
                        if(newWW != winWidth){
                            $scope.render($scope.$parent.exploreData);
                            windWidth = newWW;
                        }
                    }, 600);

                });

                $scope.render = function(data) {
                    // console.log(data);
                    // remove all previous items before render
                    svg.selectAll('*').remove();
                    // If we don't pass any data, return out of the element
                    if (!data) return;
                    // get full date range data to set domains
                    var fullDateRange = data.date.date_hist.buckets;

                    
                    /* CHART SETUP
                    ***************************/
                    var lOffset = parseInt(ele.css('margin-left').replace('px', '')) + 1;
                    var width = ele.parent().width() - lOffset - margin.right - margin.left;
                    var chartHeight = height - margin.top - margin.bottom;

                    // parse range from searchString
                    // var selectedRange = searchString.vars.filter.date;

                    // pad end of timescale by one year.
                    var fullDateExtent = d3.extent(fullDateRange, function(d){return d.key;});
                    var endDate = new Date(fullDateExtent[1]);
                    endDate = endDate.setFullYear(endDate.getFullYear() + 2);

                    // set domain
                     var x = d3.time.scale()
                            .domain([fullDateExtent[0], endDate])
                            .nice(d3.time.year)
                            .range([0, width]);

                    // use years to calculate bar width (width = 1 year). might need to adjust if metadata is more fine grained.
                    var yearSpan = (function(){
                        var format = d3.time.format('%Y');
                        return format(x.domain()[1]) - format(x.domain()[0]);
                    })();

                    var y = d3.scale.linear()
                            .range([chartHeight, 0]);
                            // .domain(0, d3.extent(fullDateRange, function(d){ return d.doc_count; })[1])

                    var yMax = function(){
                        var counts = [];
                        fullDateRange.forEach(function(d){
                                counts.push(d.doc_count);
                        });
                        var max = d3.max(counts);
                        return max + max*0.05;
                    };

                    y.domain([0, yMax()]);
                    // console.log('ydomain', y.domain(), 'yrange', y.range())

                    // set axes
                    var xAxis = d3.svg.axis()
                                .scale(x)
                                .orient('bottom')
                                .tickSize(3);

                    var yAxis = d3.svg.axis()
                                .scale(y)
                                .orient('right')
                                .tickSize(width)
                                .tickFormat(d3.format("d"))
                                .ticks(5);

                    // DRAW THE CHART
                    svg.attr('width', width + margin.left + margin.right)
                        .attr('height', height);

                    var chart = svg.append('g')
                            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                    // add x axis
                    var gx = chart.append('g')
                        .attr('class', 'xaxis')
                        .attr('transform', 'translate(0,' + chartHeight +')')
                        .call(xAxis);

                    // add y axis
                    var gy = chart.append('g')
                        .attr('class', 'yaxis')
                        .call(yAxis);
                    // gy.select('line')
                    //     .attr('stroke', 'black');
                    gy.selectAll('text')
                            .attr('x', -4)
                            .attr('dy', -4);

                    // add axis labels
                    chart.append('text')
                        .attr("class", "x label")
                        .attr("text-anchor", "middle")
                        .attr("x", width/2)
                        .attr("y", height - 12)
                        .text("Year");
                    svg.append("text")
                        .attr("class", "y label")
                        .attr("text-anchor", "end")
                        .attr("y", 14)
                        .attr("x", -20)
                        .attr("transform", "rotate(-90)")
                        .text("Number of items");

                    chart.append('g').attr('class', 'barchart');

                    var barchart = chart.select('.barchart');

                    var bar = barchart.selectAll('rect');
        
                    // initialize with totals data
                    chartUpdate(data.date, 'bluebars');

                    // console.log('EXPLOREDATA', data);

                    /* CHART UPDATE
                    ***************************/
                    function chartUpdate(data, extraclass) {
                        // console.log(data);
                        barchart.selectAll('rect').remove();

                        var w = width;
                        var thisData = data.date_hist.buckets;

                        var yMax = function(){
                            var counts = [];
                            thisData.forEach(function(d){
                                    counts.push(d.doc_count);
                            });
                            var max = d3.max(counts);
                            return max + max*0.05;
                        };

                        y.domain([0, yMax()]);

                        gy.transition(800).call(yAxis)
                        .selectAll('text')
                            .attr('x', -4)
                            .attr('dy', -4);

                        barchart.attr('class', 'barchart ' + extraclass);

                        var barUpdate = bar.data(thisData);
                        barUpdate.enter().append('rect')
                            .attr('class', 'bar ')
                            .attr('x', function(d){return x(d.key);  })
                            .attr('width', w/yearSpan)
                            .attr('y', chartHeight)
                            .attr('height', 0)
                            .transition(800)
                                .attr('y', function(d){ return y(d.doc_count); })
                                .attr('height', function(d){ return chartHeight -y(d.doc_count); });
                        barUpdate.exit().remove();

                    }
                    // update data on data switch event
                    $scope.$on('switchData', function(e, switchData){
                        // console.log(switchData);
                        var showThisData;
                        if (switchData.key === 'total') {
                            showThisData = data.date;
                        } else {
                            showThisData = getChartData(switchData.key, switchData.id);
                        }
                        chartUpdate(showThisData, switchData.cl);
                        function getChartData(key, id){
                            // console.log(key,id);
                            var dArray = data[key];
                            for (var i=0; i < dArray.length; i++){
                                if (dArray[i].id === id) {
                                    // console.log(dArray[i]);
                                    return dArray[i];
                                }
                            }

                        }

                    });

                    // BRUSH BEHAVIORS (DATE SELECTIONS)
                    var brush = d3.svg.brush()
                                .x(x)
                                // .extent(x.domain())
                                .on("brushstart", brushstart)
                                .on("brush", brushmove)
                                .on("brushend", brushend);

                    // brush background
                    var brushbg = chart.append('g')
                            .attr('class','brushbg');

                    // call brush
                    var brushg = chart.append("g")
                        .attr("class", "brush")
                        .call(brush);

                    brushbg.append('rect')
                        .attr('class', 'bbg l')
                        .attr('height', chartHeight);

                    brushbg.append('rect')
                        .attr('class', 'bbg r')
                        .attr('height', chartHeight);

                    // brush ends / 'handles'
                    var handles = brushg.selectAll(".resize")
                        .attr('x', '-5')
                        .attr('width', '10');

                    handles.append('rect')
                            .attr({
                                'x' : -1,
                                'y' : 0,
                                'width' : 2,
                                'visibility': 'visible',
                                'fill' : 'orange'
                            })

                    handles.append('rect')
                            .attr({
                                'x' : -1,
                                'y' : chartHeight,
                                'width' : 2,
                                'height': 12,
                                'visibility': 'visible',
                                'fill' : 'orange',
                                'class' : 'bStub'
                            })         

                    brushg.selectAll('.background')
                            .style({'visibility': 'hidden', 'fill': 'none'})
                            .append('rect')
                                .attr('class', 'left')
                                .attr('x', 0)
                                .attr('width', 20);

                    brushg.selectAll("rect")
                        .attr("height", chartHeight);

                    function brushstart() {
                        // updateRangeBrush();
                    }

                    function brushmove() {
                        handleDates();
                        updateBBG();
                    }

                    function brushend() {
                        // if empty or full domain return without call to rescale and clear bg
                        if (brush.empty() || d3.values(brush.extent()).join() === d3.values(x.domain()).join()){
                            clearBrush();
                            $scope.passUp({
                                obj: {
                                    act: 'filterDate',
                                    key: 'nodate'
                                }
                            });
                            return;
                        } else {
                            $scope.passUp({
                                obj: {
                                    act: 'filterDate',
                                    key: 'date',
                                    begin: {
                                        display: displayDate(brush.extent()[0]),
                                        key: +brush.extent()[0]
                                    },
                                    end: {
                                        display: displayDate(brush.extent()[1]),
                                        key: +brush.extent()[1]
                                    }
                                }
                            });   
                        }
                    }

                    function clearBrush(){
                            brushbg.selectAll('.bbg')
                                .attr('width', 0);
                            brush.extent(0);
                            d3.select('.brush').call(brush.clear());
                    }

                    $scope.$on('unfilter', function(e, obj){
                        // ignore date objects.
                        if(obj.key === 'dates') {
                            clearBrush();
                        } else {
                            return;
                        }
                    });

                    // show selected dates on handles
                    function handleDates(){
                        var wResize = brushg.select('.resize.w');
                        var eResize = brushg.select('.resize.e');
                        var wExtent = [];
                        wExtent = displayDate(brush.extent()[0]);
                        eExtent = displayDate(brush.extent()[1]);

                        var wText = wResize.selectAll("text.wText")
                            .data([wExtent]);
                        wText.enter()
                            .append("text")
                            .attr({
                                'x' : 4,
                                'y' : chartHeight + 30,
                                'fill' : 'orange',
                                'font-size' : '12px',
                                'class' : 'wText'
                            });
                        wText.text(function(d){return d});

                        var eText = eResize.selectAll("text.eText")
                            .data([eExtent]);
                        eText.enter()
                            .append("text")
                            .attr({
                                'x' : -28,
                                'y' : chartHeight + 30,
                                'fill' : 'orange',
                                'font-size' : '12px',
                                'class' : 'eText'
                            });
                        eText.text(function(d){return d});
                    }

                    function updateBBG() {
                        // update background shading around brush selection
                        var eX = parseInt(svg.selectAll('.brush .extent').attr('x')) || 0;
                        var eW = parseInt(svg.selectAll('.brush .extent').attr('width')) || width;
                        svg.select('.bbg.l')
                            .attr('x', 0)
                            .attr('width', function(){
                                return eX;
                        });
                        svg.select('.bbg.r')
                            .attr('x', function(){
                                // console.log('x', eX, 'w', eW, 'both', eX + eW);
                                return eX + eW;
                            })
                            .attr('width', function(){
                                return Math.max((width - eW - eX), 0);
                        });
                    }

                    function clearBBG() {
                        svg.select('.bbg.l')
                            .attr('x', 0)
                            .attr('width', 0);
                        svg.select('.bbg.r')
                            .attr('x', 0)
                            .attr('width', 0);
                    }

                    function displayDate(d) {
                        var format = d3.time.format('%Y');
                        var display = format(d);
                        var negative = /^-\d+$/;

                        if(display.match(negative)){
                            display = display.replace(/^-(0*)?/, '');
                            display = display.concat(' BCE');
                            // console.log(display);
                        } else {
                            display = display.replace(/^(0{1,3})?/, '');
                        }
                        return display;
                    }
                    function resetZoom(){
                        zoom.scale(1);
                        zoom.translate([0,0]);
                        zoom.center(0,0);
                        // console.log(zoom.scale(), zoom.translate())
                        // zoom.translate(0, 0);
                        rescale();
                        clearBBG();
                    }
                }
            }
        }
    }]);

});