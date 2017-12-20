var totWidth = 2000,
    totHeight = totWidth * 2,
    margin = {top: 80, right: 30, bottom: 80, left: 215},
    width = totWidth - (margin.left + margin.right),
    height = totHeight - (margin.top + margin.bottom);

var relColor = d3.scale.linear()
    .domain([2, 5])
    .range(["red", "green"]);

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
    .orient("left")

var chart = d3.select(".chart")
    .attr("width", totWidth)
    .attr("height", totHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("pivot_rating_c.csv", function (error, data) {

    d3.csv("pivot_rating_c.csv", function (error, relData) {

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
                d.groups2 = grpNames.map(function (name){
                    return {name: name, value: +rel[name]}
                });
            });
        });

        data.forEach(function (d){
            d.groups.forEach(function (gd, index){
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
            // .style("fill-opacity", function (d) {
            //     return 1
            //     // debugger
            //     // return color(d.category);
            // })
            .style("fill", function (d, i, j) {
                    return color(d.category);
                }
            )
        ;

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
                    debugger
                    // var gbval = 1+Math.floor(255 - (255/4*(d.value-1)));
                    // return "rgb(" + 255 + "," + gbval + "," + gbval + ")";
                debugger
                    return relColor(d.value)
                }
            )
            .style("stroke", "black")
        ;

        debugger
    });
});