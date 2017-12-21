var totWidth = 2000,
    totHeight = totWidth * 2,
    margin = {top: 80, right: 30, bottom: 80, left: 215},
    width = totWidth - (margin.left + margin.right),
    height = totHeight - (margin.top + margin.bottom);

var relColor = d3.scale.linear()
    .domain([2, 5])
    .range(["red", "green"]);

var hslSat = d3.scale.linear()
    .domain([15, 50, 300])
    .range([0.4, 0.9, 1]);

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width]);

var y = d3.scale.ordinal()
    .rangeRoundBands([height, 0]);

var color = d3.scale.category20();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("top");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var colorHSL

var chart = d3.select(".chart")
    .attr("width", totWidth)
    .attr("height", totHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("pivot_rating_c.csv", function (error, data) {

    d3.csv("pivot_counts.csv", function (error, relData) {

        var opaScale = d3.scale.linear()
            .domain([0, 100])
            .range([30, 255]).nice();


        var grpNames = d3.keys(data[0]).filter(function (key) {
            return (key !== "business_name") && (key !== "category")
        });

        data.forEach(function (d) {
            grpNames.map(function (name) {
                d[name] ? d[name] : d[name] = "0"
            });
        });

        relData.forEach(function (d) {
            grpNames.map(function (name) {
                d[name] ? d[name] : d[name] = "0"
            });
        });

        data.forEach(function (d) {
            d.groups = grpNames.map(function (name) {
                return {name: name, value: +d[name], category: d.category};
            });
        });

        data.forEach(function (d) {
            relData.forEach(function (rel) {
                d.groups2 = grpNames.map(function (name) {
                    return {name: name, value: +rel[name]}
                });
            });
        });

        data.forEach(function (d) {
            d.groups.forEach(function (gd, index) {
                gd.rel = +d.groups2[index].value
            })
        })

        y.domain(data.map(function (d) {
            return d.business_name
        }));
        var allcols = Object.keys(data[0]),
            cols = allcols.slice(2, allcols.length);
        x.domain(grpNames);

        chart.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0,0)")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "start")
            .attr("transform", "rotate(-90)")
            .attr("dx", "0.5em")
            .attr("dy", x.rangeBand() / 2 - 10);

        chart.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        var grows = chart.selectAll(".grow")
            .data(data)
            .enter().append("g")
            .attr("class", "grow")
            .attr("transform", function (d) {
                return "translate(0," + y(d.business_name) + ")";
            });

        var gcells = grows.selectAll(".gcell")
            .data(function (d) {
                return d.groups;
            })
            .enter().append("g")
            .attr("transform", function (d, i, j) {
                return "translate(" + i * x.rangeBand() + ",0)";
            })
            .attr("class", "gcell");

        gcells
            .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("height", y.rangeBand())
            .attr("width", x.rangeBand())
            .style("fill-opacity", function (d) {
                return 0.5
                // debugger
                // return color(d.category);
            })
            .style("fill", function (d, i, j) {
                    return color(d.category);
                }
            );

        rmax = Math.min(y.rangeBand() / 2 - 4, x.rangeBand() / 2 - 4)
        gcells.append("circle")
            .attr("cy", y.rangeBand() / 2)
            .attr("cx", x.rangeBand() / 2)
            .attr("r", function (d) {
                    var rind = d.value;
                    return rind * 3
                }
            )
            // .style("fill-opacity", function (d) {
            //     debugger
            //     return opaScale(d.rel)
            // })
            .style("fill", function (d) {
                    d.value > 2.5 ? colorHSL = d3.hsl(135, 0, 0.5) :  colorHSL = d3.hsl(0, 0, 0.5);
                    colorHSL.s = hslSat(+d.rel);
                    return colorHSL
                }
            )
            .style("stroke", "black");

        debugger

        var legend = chart
            .append("g")
            .attr("transform", "translate(0," + (height + 0) + ")")
            .attr("class","legend")
            .style("font-weight","bold")

        var legwidths = [0, 50, 100, 150, 200];

        var legsymbols = legend.selectAll(".legsymbols")
            .data(["1","2","3","4","5"])
            .enter()
            .append("g")
            .attr("class","legsymbols")
            .attr("transform",function(d,i) {return "translate(" + (65 + legwidths[i] ) + ",0)";});


        var legendspace = 5;


        legsymbols.append("circle")
            .attr("cx", function(d,i) {return rmax / ((-1)*((i+1) - 6)) ;})
            .attr("cy", function(d,i) {return (legendspace+2*rmax) - (rmax / ((-1)*((i+1) - 7))) ;})
            .style("fill", function(d,i) {
                return d3.hsl(255, 1, 1)
                }
            )
            .style("stroke","black")
            .attr("r", function(d,i) {
                debugger
                return +d * 3
                }
            )
        ;


        legsymbols.append("text")
            .attr("x", function(d,i) {return 5+2*rmax / ((-1)*((i+1) - 5.9)) ;})
            .attr("y", legendspace + 2*rmax)
            .style("text-anchor", "start")
            .text(function(d) { return d; });

        legend
            .append("text")
            .text("Ratings:")
            .attr("y", rmax*2+ legendspace)
        ;

        var legends = chart
            .append("g")
            .attr("transform", "translate(325," + (height + 0) + ")")
            .attr("class","legends")
            .style("font-weight","bold")

        var legwidths = [0, 50, 100, 150, 200];

        var legsymbols = legends.selectAll(".legsymbols")
            .data(["15", "25", "35", "50"])
            .enter()
            .append("g")
            .attr("class","legsymbols")
            .attr("transform",function(d,i) {return "translate(" + (175 + legwidths[i] ) + ",0)";});


        var legendspace = 5;


        legsymbols.append("circle")
            .attr("cx", function(d,i) {return rmax / ((-1)*((i+1) - 6)) ;})
            .attr("cy", function(d,i) {return (legendspace+2*rmax) - (rmax / ((-1)*((i+1) - 7))) ;})
            .style("fill", function(d,i) {
                    return d3.hsl(0, hslSat(+d), 0.5)
                }
            )
            .style("stroke","black")
            .attr("r", 15)
        ;


        legsymbols.append("text")
            .attr("x", function(d,i) {return rmax + (i + 2 * 10)/ ((-1)*((i+1) - 6)) ;})
            .attr("y", legendspace + 2*rmax)
            .style("text-anchor", "start")
            .text(function(d) { return d; });

        legends
            .append("text")
            .text("Reliability (Negative):")
            .attr("y", rmax*2+ legendspace)
        ;


        var legends = chart
            .append("g")
            .attr("transform", "translate(720," + (height + 0) + ")")
            .attr("class","legends2")
            .style("font-weight","bold")

        var legwidths = [0, 50, 100, 150, 200];

        var legsymbols = legends.selectAll(".legsymbols")
            .data(["15", "25", "35", "50"])
            .enter()
            .append("g")
            .attr("class","legsymbols")
            .attr("transform",function(d,i) {return "translate(" + (175 + legwidths[i] ) + ",0)";});


        var legendspace = 5;


        legsymbols.append("circle")
            .attr("cx", function(d,i) {return rmax / ((-1)*((i+1) - 6)) ;})
            .attr("cy", function(d,i) {return (legendspace+2*rmax) - (rmax / ((-1)*((i+1) - 7))) ;})
            .style("fill", function(d,i) {
                    return d3.hsl(135, hslSat(+d), 0.5)
                }
            )
            .style("stroke","black")
            .attr("r", 15)
        ;


        legsymbols.append("text")
            .attr("x", function(d,i) {return rmax + (i + 2 * 10)/ ((-1)*((i+1) - 6)) ;})
            .attr("y", legendspace + 2*rmax)
            .style("text-anchor", "start")
            .text(function(d) { return d; });

        legends
            .append("text")
            .text("Reliability (Positive):")
            .attr("y", rmax*2+ legendspace)
        ;

        var legends = chart
            .append("g")
            .attr("transform", "translate(0," + (height + 25) + ")")
            .attr("class","legends2")
            .style("font-weight","bold")

        // var legwidths = [0, 50, 100, 150, 200];

        var legsymbols = legends.selectAll(".legsymbols")
            .data(color.domain())
            .enter()
            .append("g")
            .classed("legendt", true)
            .attr("transform",function(d,i) {return "translate(" + ((i +1) * 110 ) + ",0)";});


        var legendspace = 5;


        legsymbols.append("circle")
            .attr("cx", function(d,i) {return 5 ;})
            .attr("cy", function(d,i) {return 30 ;})
            .style("fill", function(d,i) {
                return color(d)
                }
            )
            .style("fill-opacity", function (d) {
                return 0.5 })
            .style("stroke","black")
            .attr("r", 5)
        ;


        legsymbols.append("text")
            .attr("x", -20)
            .attr("y", 50)
            .style("text-anchor", "start")
            .text(function(d) {
                if(d == "American (Traditional)")
                    d = "American"
                return d; });

        legends
            .append("text")
            .text("Categories:")
            .attr("y", rmax*2+ legendspace)
        ;

        debugger
    });
});