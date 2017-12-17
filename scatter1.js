var margin = {
        top: 20,
        right: 210,
        bottom: 50,
        left: 70
    },
    outerWidth = 1050,
    outerHeight = 500,
    width = outerWidth - margin.left - margin.right,
    height = outerHeight - margin.top - margin.bottom;


var labels = {
    "Category": "Category",
    "Rating": "Rating",
    "Confidence": "Confidence",
    "Numbers": "Number of restaurants"
}

d3.csv("yelp_cat_avg.csv", function(data) {
    var maxRating = d3.max(data, function(d){
        return +d["Rating"];
    });
    var minRating = d3.min(data, function(d){
        return +d["Rating"];
    });
    var maxConfidence = d3.max(data, function(d){
        return +d["Confidence"]
    });
    var minConfidence = d3.min(data, function(d){
        return +d["Confidence"]
    });
    var maxNumbers = d3.max(data, function(d){
        return +d["Numbers"]
    });
    var minNumbers = d3.min(data, function(d){
        return +d["Numbers"]
    });

    var x = d3.scale.linear()
        .range([0, width]).nice()
        .domain([minRating - 0.2, maxRating + 0.1]);

    var y = d3.scale.linear()
        .range([height, 0]).nice()
        .domain([0, maxConfidence + 10]);

    var rx = d3.scale.linear()
        .range([10, 40]).nice()
        .domain([minNumbers, maxNumbers]);

    var color = d3.scale.category20();

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")

    var tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-10, 0])
        .html(function(d) {
            return labels["Category"] + ": " + d["Category"] + "<br>" + labels["Rating"] + ": " + d["Rating"]+ "<br>" + labels["Confidence"] + ": " + d["Confidence"]+ "<br>" + labels["Numbers"] + ": " + d["Numbers"];
        });

    var zoomBeh = d3.behavior.zoom()
        .x(x)
        .y(y)
        .scaleExtent([0, 1000])
        .on("zoom", zoom);

    var svg = d3.select("#scatter1")
        .append("svg")
        .attr("width", outerWidth)
        .attr("height", outerHeight)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoomBeh);

    svg.call(tip);

    svg.append("rect")
        .attr("width", width)
        .attr("height", height);

    svg.append("g")
        .classed("x axis", true)
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .classed("label", true)
        .attr("x", width)
        .attr("y", margin.bottom - 10)
        .style("text-anchor", "end")
        .text("Rating");

    svg.append("g")
        .classed("y axis", true)
        .call(yAxis)
        .append("text")
        .classed("label", true)
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left)
        .attr("dy", "1.5em")
        .style("text-anchor", "end")
        .text("Confidence");

    var objects = svg.append("svg")
        .classed("objects", true)
        .attr("width", width)
        .attr("height", height);

    objects.append("svg:line")
        .classed("axisLine hAxisLine", true)
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", width)
        .attr("y2", 0)
        .attr("transform", "translate(0," + height + ")");

    objects.append("svg:line")
        .classed("axisLine vAxisLine", true)
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", height);

    objects.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .classed("dot", true)
        .attr({
            r: function(d) {
                return rx(d["Numbers"]);
            },
            cx: function(d) {
                return x(d["Rating"]);
            },
            cy: function(d) {
                return y(d["Confidence"]);
            }
        })
        .style("fill", function(d) {
            return color(d["Category"]);
        })
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);

    var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .classed("legend", true)
        .attr("transform", function(d, i) {
            return "translate(0," + i * 20 + ")";
        });

    legend.append("rect")
        .attr("x", width + 10)
        .attr("width", 12)
        .attr("height", 12)
        .style("fill", color);

    legend.append("text")
        .attr("x", width + 26)
        .attr("dy", ".65em")
        .text(function(d) {
            return d;
        });

    function zoom() {
        svg.select(".x.axis").call(xAxis);
        svg.select(".y.axis").call(yAxis);
        svg.selectAll(".dot")
            .attr({
                cx: function(d) {
                    return x(d["Rating"]);
                },
                cy: function(d) {
                    return y(d["Confidence"]);
                }
            })
    }


});