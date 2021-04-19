var svgWidth = 960;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  left: 60,
  bottom: 100
};

// calculate chart height and width
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
 
//append an svg element to the chart 
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight); 

//append an svg group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
 