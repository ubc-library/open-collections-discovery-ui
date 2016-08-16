define(function (require){

    var angular = require('angular'),
        d3 = require('d3'),
        d3charts = require('d3directives'),
        dlServices = require('services/services');
    
    d3charts.directive('d3OneBar',['$window', '$timeout', 'utility', function($window, $timeout, utility){

    return {
        restrict: 'EA',
        scope: {
            data: '=',
            title: '@',
            container: '@',
            passUp: '&'
        },
        link: function(scope, ele, attrs){

            // console.log('d3 type data' , scope.data);

            var renderTimeout;

            // console.log(scope.title);

            // var title = scope.title;

             var margin = {
                    top: parseInt(attrs.margin) || 3,
                    right: parseInt(attrs.margin) || 0,
                    bottom: parseInt(attrs.margin) || 3,
                    left: parseInt(attrs.margin) || 0,
                },
                barHeight = parseInt(attrs.barHeight) || 3,
                barPadding = parseInt(attrs.barPadding) || 3;

            var svg = d3.select(ele[0])
                .append('svg')
                // .style('width', '100%')
                .style('width', "100%")
                .attr('height', 10);

            var chartData;

            // watch for data updates
            scope.$watch('data', function(newVals, oldVals) {

                if(!newVals && !oldVals) { return;}

                newVals = utility.objToArray(newVals);

                if(scope.title === 'type'){
                    reorder(oldVals);
                    reorder(newVals);
                } 
                
                chartData = parseVals(newVals);

                return scope.render(chartData);

                function reorder(input) {
                    if (!input) { return; }
                    input.sort(function(a, b){
                            return d3.ascending(a.key, b.key);
                        });
                    return input;
                }

                // clean out bracketed values & add ID values if they don't already exist
                function parseVals(arr){ // needs to be an array!
                    if(!arr) { return; }
                    var noBrackets = [];
                    var re = /\[(.*?)\]/;
                    for (var i = 0; i < arr.length; i++){
                        if (!arr[i].key.match(re)){
                            if(!arr[i].id){
                                arr[i].id = scope.title + i;
                            }
                            noBrackets.push(arr[i]);
                        }
                    }
                    return noBrackets;
                }
                
            }, false);

            // re-render on window resize
            var winWidth = $(window).width();
            window.addEventListener('resize', function() {
                var newWW = $(window).width();
                $timeout(function(){
                    if(newWW != winWidth){
                        scope.render(chartData);
                        windWidth = newWW;
                    }
                }, 600);

            });

            scope.render = function(graphData) {
                // remove all previous items before render

                var newWidth = scope.container ? $(scope.container).width() : ele.width();
                // var newWidth = ele.width();
                svg.selectAll('*').remove();
                svg.attr('width', newWidth);

                // If we don't pass any data, return out of the element
                if (!graphData) return console.log('NO ONEBAR DATA');

                // console.log(data);

                // setup variables
                // var width = d3.select(ele[0]).node().offsetWidth - margin,
                var width = newWidth -margin.left -margin.right,
                    // calculate the height
                    chartHeight = 2 * (barHeight + barPadding),

                    // Use the category20() scale function for multicolor support
                    color = d3.scale.category10(),

                    // our xScale
                    xScale = d3.scale.linear()
                      .domain([0, d3.sum(graphData, function(d) {
                        return d.doc_count;
                      })])
                      // .range([0, 100]); // use for percentage based
                      .range([0, newWidth]);

                    // console.log(xScale.domain());

                // set the height based on the calculations above
                svg.attr('height', chartHeight + margin.top + margin.bottom);

                //create the rectangles for the bar chart
                var offsets = [0];

                var chart = svg.append('g')
                        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                // alternating color scale (http://blog.simontimms.com/2013/07/08/quick-custom-colour-scales-in-d3js/)
                var alternatingColorScale = function(){
                  var domain, range;
                    function scale(x){
                        return range[domain.indexOf(x)%range.length];
                    }
                    scale.domain = function(x){
                        if(!arguments.length) return domain;
                        domain = x;
                        return scale;
                    };
                    scale.range = function(x){
                        if(!arguments.length) return range;
                        range = x;
                        return scale;
                    };
                     return scale;
                };

                var bar;
                // use "type" color classes if type data
                if(scope.title === 'type'){
                    bar = chart.selectAll('g')
                      .data(graphData)
                      .enter().append('g')
                      .attr('class', function(d){ return d.id + ' ' + 'typebar ' + d.key.toLowerCase();});
                    //   .attr('transform', function(d, i) { 
                    // });
                } else {
                // use brewer 8 color scale (numbered classes)
                    var brewClasses = alternatingColorScale()
                        .domain(graphData.map(function(d){ return d.key; }))
                        .range(['brewer0','brewer1','brewer2','brewer3','brewer4','brewer5','brewer6','brewer7']);

                    bar = chart.selectAll('g')
                      .data(graphData)
                      .enter().append('g')
                      .attr('class', function(d,i){ return d.id + ' ' + brewClasses(d.key);});
                    //   .attr('transform', function(d, i) { 
                    // });
                }

                bar.append('rect')
                    .attr('height', barHeight)
                    .attr('width', 5)
                    // .attr('fill', function(d) { return color(d.doc_count); })
                    .attr('x', 0)
                    .attr('y', 10)
                    .each(function(d){
                        // console.log(this.getBBox())
                    })
                    .transition()
                      .duration(800)
                      .attr('x', function(d,i){
                        var offset = d3.sum(offsets.slice(0,i+1));
                        // console.log(i, offset);
                        offsets.push(xScale(d.doc_count));
                        return offset;
                      })
                      .attr('width', function(d) {
                        return xScale(d.doc_count);
                      });
                      
                bar.append('text')
                    .attr('opacity', 0)
                    .text(function(d) { 
                        return (scope.title === 'type') ? d.key + 's (' + d.doc_count +')' : d.key + ' (' + d.doc_count +')';
                    })
                    .attr('x', function(d,i){
                        var offset = d3.sum(offsets.slice(0,i+1));
                        // add code here to hide text if width - offset is too small
                        // if possible, show on hover instead.
                        return offset;
                    })
                    .attr('y', 0)
                    .attr('dy', '.71em')
                                        .attr('class', function(d){ 
                        return d.key + ' b-text';
                    });

                // make active if the text fits
                // timeout makes sure text is there (prevents firefox bug), makes text appear with animated bar
                $timeout(function(){
                    bar.select('text')
                        .attr('text-anchor', function(d){
                            var diff = newWidth - parseInt(d3.select(this).attr('x'));
                            if (diff < this.getBBox().width) { return 'end';}
                            return 'start';
                        })
                        .classed("active", function(d,i){
                            var boxW = xScale(d.doc_count);
                            var textW = this.getBBox().width;
                            // console.log(textW, boxW, this);
                            // console.log(this)
                            if (textW === 0) { return false; } 
                            else {
                                return (textW < boxW) ?  true : false;
                            }

                        });
                }, 300);


                    
                // pass click up to Angular app scope ()
                // use this for adding/removing facet limiters
                bar.on('click', function(d,i){

                    barSelect(this);
                    
                    // return scope.passUp({key: d.key});
                    return scope.passUp({
                        obj: {
                            act: 'filter',
                            term: d.key,
                            key: scope.title
                        }
                    });
                });

                function barSelect(t){
                    var c = t.getAttribute('class');
                    var m = /selected/gi;
                    if(c.match(m)){
                        // t.classList.remove('selected'); // classList doesn't work in IE on svgs
                        t.setAttribute('class', c.replace(m, ''));
                        d3.select(t).select('rect').transition(200).attr('height', barHeight);
                    } else {
                        // console.log(t);
                        // t.classList.add('selected');
                        t.setAttribute('class', c + ' selected');
                        d3.select(t).select('rect').transition(200).attr('height', barHeight + 3);
                    }
                }

                // if pass-hover exists, act on hover states
                // use this to effect changes on hover state in data explorer date-graph

                bar.on('mouseover', function(d,i){
                    var c = this.getAttribute('class');
                    focusText(c);
                    return scope.passUp({
                        obj: {
                            act: 'switchData',
                            term: d.key,
                            key: scope.title,
                            cl: c,
                            id: d.id
                        }
                    });
                });

                function focusText(c){
                    var cl = '.' + c.match(/([^\s]+)/)[0];
                    // console.log(c.match(/([^\s]+)/), cl);
                    bar.select('text').classed('active', false);
                    d3.select(cl + ' .b-text').classed('active', true);
                }

                // watch for 'unfilter' broadcast to remove filters
                scope.$on('unfilter', function(e, obj){

                    // ignore date objects.
                    if(obj.key === 'dates') { return; }

                    var allTheD = d3.selectAll('.dl-one-bar rect').data();

                    for (var i=0; i < allTheD.length; i++){
                        if(allTheD[i].key === obj.term){
                            // console.log(allTheD[i]);
                            var t = d3.select('.' + allTheD[i].id);
                            t.classed('selected', false).select('rect').transition(200).attr('height', barHeight);
                        }
                    }
                });


            };
            }
        };
    }]);

});