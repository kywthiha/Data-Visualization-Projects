const render = (data)=>{
const width = 800
const height = 500
const template = "#bar_char"
const margin = { top :20 , bottom : 30 , left: 50 , right : 50 }
const innerWidth = width - margin.left - margin.right
const innerHeight = height - margin.bottom - margin.top
const xValue = (d,i)=>(d[0])
const yValue = (d,i)=>(d[1])

const svg = d3.select(template).append('svg')
svg.attr('width',width)
    .attr('height',height)
const rectGroup = svg.append('g')

const xScale = d3.scaleBand()
    .domain(data.map(xValue))
    .range([0,innerWidth])
    .padding(0.2)

const  xScaleTime = d3.scaleTime()
    .domain([d3.min(data,(d,i)=>new Date(xValue(d,i))), d3.max(data,(d,i)=>new Date(xValue(d,i)))])
    .range([0,innerWidth]);
const  xAxis = d3.axisBottom(xScaleTime)
const xAxisGroup = svg.append('g')
.attr('id','x-axis')
.attr('transform',`translate(${margin.left},${innerHeight+margin.top})`)
.call(xAxis)

const yScale = d3.scaleLinear()
    .domain([0,d3.max(data,yValue)])
    .range([innerHeight,0])

const  yAxis = d3.axisLeft(yScale);
const yAxisGroup = svg.append('g')
.attr('id','y-axis')
.attr('transform',`translate(${margin.left},${margin.top})`)
.call(yAxis)
rectGroup.attr('transform',`translate(${margin.left},0)`)

const Tooltip = d3.select(template)
.append("div")
.style("opacity", 0)
.attr('id','tooltip')
.attr("class", "tooltip")

const mouseover = function(d,i) {
  Tooltip
    .html(`GDP : ${yValue(d,i)} <br> Year : ${xValue(d,i)}`)
    .attr('data-date',xValue(d,i))
    .style("opacity", 1)
  d3.select(this)
    .style("stroke", "black")
    .style("opacity", 1)
}
const mousemove = function(d) {
  Tooltip
    .style("left", (d3.event.pageX)+10 + "px")
    .style("top", (d3.event.pageY)-3 + "px")
}
const mouseleave = function(d) {
  Tooltip
    .style("opacity", 0)
  d3.select(this)
    .style("stroke", "none")
    .style("opacity", 0.8)
}

rectGroup.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('fill','steelblue')
    .attr('data-date',(d,i)=>xValue(d,i))
    .attr('data-gdp',(d,i)=>yValue(d,i))
    .attr('class','bar')
    .attr('x',(d,i)=>xScale(xValue(d,i)))
    .attr('y',(d,i)=>yScale(yValue(d,i))+margin.top)
    .attr('width',xScale.bandwidth())
    .transition()
    .delay((d, i) => i * 50)
    .attr('height',(d,i)=>(innerHeight-yScale(yValue(d,i))))
    .on('mouseover',mouseover)
    .on('mouseleave',mouseleave)
    .on('mousemove',mousemove)
}

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
.then((data)=>(data.data))
.then((data)=>{
    console.log(data)
    render(data)
});