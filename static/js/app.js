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

//function for y axis selection 
function scaleY(data, axisY) {
    
    var scaleLinearY = d3.scaleLinear()
      .domain([d3.min(data, d => d[axisY]) * 0.5,
               d3.max(data, d => d[axisY]) * 1.5])
      .range([height, 0]);
  
    return scaleLinearY;
}

// update axis
function featureAxis(newScaleX, axisX, newScaleY, axisY) {

    var axisBottom = d3.axisBottom(newScaleX);
    var axisLeft = d3.axisLeft(newScaleY);
  
    axisX.transition()
         .duration(1000)
         .call(axisBottom);

    axisY.transition()
         .duration(1000)
         .call(axisLeft); 

    return {"axisX": axisX, "axisY": axisY}; 
} 
   
// update texts and circles
function featureCirclesAndText(circlesGroup, newScaleX, newScaleY, chosenAxisX, chosenAxisY) {

  circlesGroup.transition()
    .duration(1000)
    .attr('circlex', data => newScaleX(data[chosenAxisX]))
    .attr('circley', data => newScaleY(data[chosenAxisY]))

  textGroup.transition()
    .duration(1000)
    .attr('x', d => newScaleX(data[chosenAxisX]))
    .attr('y', d => newScaleY(data[chosenAxisY]));
 
  return {"circleGroup": circlesGroup, "testGroup": textGroup};
}

//update circle groups for tooltip
function updateToolTip(chosenAxisX, chosenAxisY, circlesGroup) {
  
  if (chosenAxisX === 'poverty') { var labelX = 'In Poverty (%):'; }
  else if (chosenAxisX === 'age') { var labelX = 'Age (Median)'; } 
  else { var labelX = 'Household Income (Median)'; }  
    
  if (chosenAxisY ==='obesity') { var labelY = "Obese (%)"; }
  else if(chosenAxisY === 'smokes') { var labelY = "Smokes (%)"; } 
  else { var labelY = "Lakes HealthCare (%)"; }
 
  //create tooltip
  var toolTip = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-8, 0])
                  .html(function(d) { 
                    return (`${d.state} <br> ${labelX} ${value}<br>${labelY} ${d[chosenAxisY]}%`);
                    });

  circlesGroup.call(toolTip);

  //add on event
  circlesGroup.on('mouseover', toolTip.show)
              .on('mouseout', toolTip.hide);

    return circlesGroup;

} 

//main function
d3.csv('../static/data/data.csv').then(function(chartData) { 
  createFeatures(chartData);
});

//retrieve data & draw chart
function createFeatures(chartData) { 

  console.log(chartData);

  chartData.forEach(function(data) {

    data.obesity = +data.obesity;
    data.income = +data.income;
    data.smokes = +data.smokes;
    data.age = +data.age;
    data.healthcare = +data.healthcare;
    data.poverty = +data.poverty;

  });

  //create linear scales
  var scaleLinearX = scaleX(chartData, chosenAxisX);
  var scaleLinearY = scaleY(chartData, chosenAxisY);
  
  //create x axis
  var axisBottom = d3.axisBottom(scaleLinearX);
  var axisLeft = d3.axisLeft(scaleLinearY);
  
  //append x
  var xAxis = chartGroup.append('g')
                        .classed('x-axis', true)
                        .attr('transform', `translate(0, ${height})`)
                        .call(axisBottom);
  
  //append y
  var yAxis = chartGroup.append('g')
                        .classed('y-axis', true)
                        //.attr
                        .call(axisLeft);
  

  
}



// function test() {
//   return 1, 2;
// } 
// console.log(test);