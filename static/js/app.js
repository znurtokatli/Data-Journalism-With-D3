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
};

//function for y axis selection 
function scaleY(data, axisY) {
    
    var scaleLinearY = d3.scaleLinear()
      .domain([d3.min(data, d => d[axisY]) * 0.5,
               d3.max(data, d => d[axisY]) * 1.5])
      .range([height, 0]);
  
    return scaleLinearY;
};

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
};
   
// update texts and circles
function featureCircles(circlesGroup, newScaleX, newScaleY, chosenAxisX, chosenAxisY) {

  circlesGroup.transition()
    .duration(1000)
    .attr('circlex', data => newScaleX(data[chosenAxisX]))
    .attr('circley', data => newScaleY(data[chosenAxisY]))

  return circlesGroup;

};

function featureText(textGroup, newScaleX, newScaleY, chosenAxisX, chosenAxisY) {

  textGroup.transition()
    .duration(1000)
    .attr('x', d => newScaleX(data[chosenAxisX]))
    .attr('y', d => newScaleY(data[chosenAxisY]));
 
  return textGroup;

};

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

};

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

  //append circle
  var circlesGroup = chartGroup.selectAll('circle')
      .data(chartData)
      .enter()
      .append('circle')
      .classed('stateCircle', true)
      .attr('cx', d => scaleLinearX(d[chosenAxisX]))
      .attr('cy', d => scaleLinearY(d[chosenAxisY]))
      .attr('r', 10)
      .attr('opacity', '.5');

  //append text
  var textGroup = chartGroup.selectAll('.stateText')
      .data(chartData)
      .enter()
      .append('text')
      .classed('stateText', true)
      .attr('x', d => scaleLinearX(d[chosenAxisX]))
      .attr('y', d => scaleLinearY(d[chosenAxisY]))
      .attr('dy', 3)
      .attr('font-size', '10px')
      .text(function(d){return d.abbr});
   
  // initial labels 
  var labelsXGroup = chartGroup.append('g')
                               .attr('transform', `translate(${width / 2}, ${height + 10 + margin.top})`);

  var labelPoverty = labelsXGroup.append('text')
      .classed('aText', true)
      .classed('active', true)
      .attr('x', 0)
      .attr('y', 20) //
      .attr('value', 'poverty')
      .text('In Poverty (%)');
      
  var labelAge = labelsXGroup.append('text')
      .classed('aText', true)
      .classed('inactive', true)
      .attr('x', 0)
      .attr('y', 40) //
      .attr('value', 'age')
      .text('Age (Median)');  

  var labelIncome = labelsXGroup.append('text')
      .classed('aText', true)
      .classed('inactive', true)
      .attr('x', 0)
      .attr('y', 60) //
      .attr('value', 'income')
      .text('Household Income (Median)')
      
  var labelsYGroup = chartGroup.append('g')
                               .attr('transform', `translate(${0 - margin.left/4}, ${height/2})`);

  var labelObesity = labelsYGroup.append('text')
      .classed('aText', true)
      .classed('inactive', true)
      .attr('x', 0)
      .attr('y', 0 - 60)
      .attr('dy', '1em')
      .attr('transform', 'rotate(-90)')
      .attr('value', 'obesity')
      .text('Obese (%)');   

  var labelSmokes = labelsYGroup.append('text')
      .classed('aText', true)
      .classed('inactive', true)
      .attr('x', 0)
      .attr('y', 0 - 40)
      .attr('dy', '1em')
      .attr('transform', 'rotate(-90)')
      .attr('value', 'smokes')
      .text('Smokes (%)');
 
  var labelHealthCare = labelsYGroup.append('text')
      .classed('aText', true)
      .classed('active', true)
      .attr('x', 0)
      .attr('y', 0 - 20)
      .attr('dy', '1em')
      .attr('transform', 'rotate(-90)')
      .attr('value', 'healthcare')
      .text('Lacks Healthcare (%)');
       
  var circlesGroup = updateToolTip(chosenAxisX, chosenAxisY, circlesGroup);
 
  //x axis labels event listener
  labelsXGroup.selectAll('text')
    .on('click', function() {
      
      var value = d3.select(this).attr('value'); //find scale value

      if (value != chosenAxisX) { //if selected another option
        
        chosenAxisX = value; 
        scaleLinearX = scaleX(chartData, chosenAxisX);
        axisX = featureAxisX(scaleLinearX, axisX);
 
        circlesGroup = featureCircles(circlesGroup, scaleLinearX, chosenAxisX, scaleLinearY, chosenAxisY);
        textsGroup = featureText(textsGroup, scaleLinearX, chosenAxisX, scaleLinearY, chosenAxisY);

        //update tooltip
        circlesGroup = updateToolTip(chosenAxisX, chosenAxisY, circlesGroup);

        //change of classes changes text
        if (chosenAxisX === 'poverty') {
            povertyLabel.classed('active', true).classed('inactive', false);
            ageLabel.classed('active', false).classed('inactive', true);
            incomeLabel.classed('active', false).classed('inactive', true);
        }
        else if (chosenAxisX === 'age') {
            povertyLabel.classed('active', false).classed('inactive', true);
            ageLabel.classed('active', true).classed('inactive', false);
            incomeLabel.classed('active', false).classed('inactive', true);
        }
        else {
            povertyLabel.classed('active', false).classed('inactive', true);
            ageLabel.classed('active', false).classed('inactive', true);
            incomeLabel.classed('active', true).classed('inactive', false);
        }
      }
    });  
 
  labelsYGroup.selectAll('text')
              .on('click', function() {

    var value = d3.select(this).attr('value');

    if(value != chosenAxisY) {

      chosenAxisY = value;
      linearScaleY = scaleY(chartData, chosenAxisY);
      
      axisY = renderaxisY(linearScaleY, axisY);

      circlesGroup = featureCircles(circlesGroup, scaleLinearX, chosenAxisX, scaleLinearY, chosenAxisY);
      textsGroup = featureText(textsGroup, scaleLinearX, chosenAxisX, scaleLinearY, chosenAxisY);

      //update tooltips
      circlesGroup = updateToolTip(chosenAxisX, chosenAxisY, circlesGroup);
 
      if (chosenAxisY === 'obesity') {
        labelObesity.classed('active', true).classed('inactive', false);
        labelSmokes.classed('active', false).classed('inactive', true);
        labelHealthCare.classed('active', false).classed('inactive', true);
      }
      else if (chosenAxisY === 'smokes') {
        labelObesity.classed('active', false).classed('inactive', true);
        labelSmokes.classed('active', true).classed('inactive', false);
        labelHealthCare.classed('active', false).classed('inactive', true);
      }
      else {
        labelObesity.classed('active', false).classed('inactive', true);
        labelSmokes.classed('active', false).classed('inactive', true);
        labelHealthCare.classed('active', true).classed('inactive', false);
      }
    }

  }); 

} 



// function test() {
//   return 1, 2;
// } 
// console.log(test);