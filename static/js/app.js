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
 
// x and y 
var chosenAxisX = 'poverty';
var chosenAxisY = 'healthcare';

//function for x axis selection 
function scaleX(data, axisX) {
    
    var scaleLinearX = d3.scaleLinear()
      .domain([d3.min(data, d => d[axisX]) * 0.5,
               d3.max(data, d => d[axisX]) * 1.5])
      .range([0, width]);

    return scaleLinearX;
}

//function for x axis selection 
function scaleY(data, axisY) {
    
    var scaleLinearY = d3.scaleLinear()
      .domain([d3.min(data, d => d[axisY]) * 0.5,
               d3.max(data, d => d[axisY]) * 1.5])
      .range([height, 0]);
  
    return scaleLinearY;
}

// update x axis
function featureAxisX(newScaleX, axisX) {

    var axisBottom = d3.axisBottom(newScaleX);
  
    axisX.transition()
         .duration(1000)
         .call(axisBottom);
  
    return axisX;
}
  
// update y axis
function featureAxisY(newScaleY, axisY) {

  var axisLeft = d3.axisLeft(newScaleY);

  axisY.transition()
       .duration(1000)
       .call(axisLeft);

  return axisY;
}











//retrieve data
d3.csv('../data/data.csv').then(function(chartData) {

  console.log(chartData);

  chartData.forEach(function(data) {

    data.obesity = +data.obesity;
    data.income = +data.income;
    data.smokes = +data.smokes;
    data.age = +data.age;
    data.healthcare = +data.healthcare;
    data.poverty = +data.poverty;

  });


  
}