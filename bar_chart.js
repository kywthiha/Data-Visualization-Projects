const render = (data)=>{
const width = 800
const height = 450
const template = "#bar_char"
const margin = { top :50 , bottom : 60 , left: 80 , right : 50 }
const innerWidth = width - margin.left - margin.right
const innerHeight = height - margin.bottom - margin.top
const xValue = (d,i)=>(d[0])
const yValue = (d,i)=>(d[1])

const svg = d3.select(template).append('svg')
svg.attr("viewBox", `0 0 ${width} ${height}`)
const rectGroup = svg.append('g')

const xScale = d3.scaleBand()
    .domain(data.map(xValue))
    .range([0,innerWidth])
    .padding(0.2)

const  xScaleTime = d3.scaleTime()
    .domain([d3.min(data,(d,i)=>new Date(xValue(d,i))), d3.max(data,(d,i)=>new Date(xValue(d,i)))])
    .range([0,innerWidth]);
const  xAxis = d3.axisBottom(xScaleTime)
.tickSizeOuter(0)
const xAxisGroup = svg.append('g')
.attr('id','x-axis')
.attr('transform',`translate(${margin.left},${innerHeight+margin.top})`)
.call(xAxis)

xAxisGroup.append('text')
.text("http://www.bea.gov/national/pdf/nipaguid.pdf")
.attr('fill','black')
.attr('x',innerWidth/2)
.attr('y',margin.bottom-10)


const yScale = d3.scaleLinear()
    .domain([0,d3.max(data,yValue)])
    .range([innerHeight,0])

const  yAxis = d3.axisLeft(yScale)
.tickSize(-innerWidth)
.tickSizeOuter(0);

const yAxisGroup = svg.append('g')
.attr('id','y-axis')
.attr('transform',`translate(${margin.left},${margin.top})`)
.call(yAxis)

yAxisGroup.append('text')
.text("Gross-Domestic-Product-1-Decimal")
.attr('fill','black')
.attr('x',-innerHeight/2 +50)
.attr('y',-margin.left/2)
.attr('transform','rotate(-90)')

rectGroup.attr('transform',`translate(${margin.left},0)`)

const title = rectGroup.append('text')
.text("United States GDP")
.attr('id','title')
.attr('fill','black')
.attr('x',innerWidth/2-150)
.attr('y',margin.top/2)


const Tooltip = d3.select(template)
.append("div")
.style("opacity", 0)
.attr('id','tooltip')
.attr("class", "tooltip")

const mouseover = function(d,i) {
 
  Tooltip
    .html(`GDP : $${yValue(d,i)} Billions <br> ${d3.timeFormat("%B %d, %Y")(new Date(xValue(d,i)))} Q${new Date(xValue(d,i)).getMonth()/3+1}`)
    .attr('data-date',xValue(d,i))
    .style("opacity", 1)
  d3.select(this)
    .style("stroke", "#205493")
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
    .attr('fill','#97BCE9')
    .attr('data-date',(d,i)=>xValue(d,i))
    .attr('data-gdp',(d,i)=>yValue(d,i))
    .attr('class','bar')
    .attr('x',(d,i)=>xScaleTime(new Date(xValue(d,i))))
    .attr('y',(d,i)=>yScale(yValue(d,i))+margin.top)
    .attr('width',xScale.bandwidth())
    .on('mouseover',mouseover)
    .on('mouseleave',mouseleave)
    .on('mousemove',mousemove)
    .transition()
    .delay((d, i) => i * 30)
    .attr('height',(d,i)=>(innerHeight-yScale(yValue(d,i))))
    
}

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
.then((data)=>(data.data))
.then((data)=>{
    console.log(data)
    render(data)
});