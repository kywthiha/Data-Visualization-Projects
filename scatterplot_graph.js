const render = (data)=>{
    const width = 800
    const height = 450
    const template = "#scatterplot_graph"
    const margin = { top :50 , bottom : 60 , left: 80 , right : 50 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.bottom - margin.top
    const xValue = (d,i)=>(new Date(d.Year,0))
    const yValue = (d,i)=>{
      const virtualdate = new Date(1970,0,1)
      virtualdate.setSeconds(d.Seconds)
      return virtualdate
    }
    const xAxisLabel = "Year"
    const yAxisLabel = "Time"
    const titleLabel = "Doping in Professional Bicycle Racing"
    const doppingLegendLabel = "Riders with doping allegations"
    const undoppingLegendLabel = "No doping allegations"
    const legendRect = 10
    const tooltipLabel = (d,i)=>(`GDP : ${d3.timeFormat("%M:%S")(yValue(d,i))} Billions <br> ${d3.timeFormat("%Y")(xValue(d,i))}`)
    
    const svg = d3.select(template).append('svg')
    svg.attr("viewBox", `0 0 ${width} ${height}`)
    const rectGroup = svg.append('g')
    
    const  xScaleTime = d3.scaleTime()
        .domain(d3.extent(data,xValue))
        .range([0,innerWidth])
        .nice();
        
    const  xAxis = d3.axisBottom(xScaleTime)
    .tickSize(-innerHeight)
    .tickPadding(8)
    .tickSizeOuter(0)
    const xAxisGroup = svg.append('g')
    .attr('id','x-axis')
    .attr('transform',`translate(${margin.left},${innerHeight+margin.top})`)
    .call(xAxis)
    
    xAxisGroup.append('text')
    .text(xAxisLabel)
    .attr('fill','black')
    .attr('x',innerWidth/2)
    .attr('y',50)
    .style('text-anchor','middle')
    
    
    const yScale = d3.scaleTime()
    .domain(d3.extent(data,yValue))
    .range([innerHeight,0])
    .nice();
    
    const  yAxis = d3.axisLeft(yScale)
    .tickSize(-innerWidth)
    .tickPadding(8)
    .tickFormat(d3.timeFormat('%M:%S'))
    .tickSizeOuter(0);
    
    const yAxisGroup = svg.append('g')
    .attr('id','y-axis')
    .attr('transform',`translate(${margin.left},${margin.top})`)
    .call(yAxis)
    
    yAxisGroup.append('text')
    .text(yAxisLabel)
    .attr('fill','black')
    .attr('x',-innerHeight/2)
    .attr('y',-50)
    .attr('transform','rotate(-90)')
    .style('text-anchor','middle')
    
    rectGroup.attr('transform',`translate(${margin.left},0)`)
    
    const title = rectGroup.append('text')
    .text(titleLabel)
    .attr('id','title')
    .attr('fill','black')
    .attr('x',innerWidth/2)
    .attr('y',30)
    .style('text-anchor','middle')

    const legendCreate = ({section,rectVolume,label,className,x=0,y=0})=>{
      const legend = section.append('g').attr('transform',`translate(${x},${y})`).attr('class',className)
      legend.append('rect')
      .attr('width',rectVolume)
      .attr('height',rectVolume)
      legend.append('text')
      .attr('y',rectVolume/2+3)
      .text(label)
      .attr('x',rectVolume+4)
    }

    const legend = rectGroup.append('g').attr('transform',`translate(${innerWidth-200},${innerHeight-50})`)
    .attr('id','legend')
    legendCreate({section:legend,rectVolume:legendRect,label:doppingLegendLabel,className:'doping'})
    legendCreate({section:legend,rectVolume:legendRect,label:undoppingLegendLabel,className:'undoping',y:20})

    const Tooltip = d3.select(template)
    .append("div")
    .style("opacity", 0)
    .attr('id','tooltip')
    .attr("class", "tooltip")
    
    const mouseover = function(d,i) {
     
      Tooltip
        .html(tooltipLabel(d,i))
        .attr('data-year',xValue(d,i))
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

    rectGroup.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('r',3)
        .attr('fill','#97BCE9')
        .attr('data-xvalue',(d,i)=>xValue(d,i))
        .attr('data-yvalue',(d,i)=>yValue(d,i))
        .attr('class',(d,i)=>d.Doping?"dot doping":"dot undoping")
        .attr('cx',0)
        .attr('cy',margin.top)
        .on('mouseover',mouseover)
        .on('mouseleave',mouseleave)
        .on('mousemove',mousemove)
        .transition()
        .duration(1000)
        .attr('cx',(d,i)=>xScaleTime(xValue(d,i)))
        .attr('cy',(d,i)=>yScale(yValue(d,i))+margin.top)
        .transition()
        .duration(1000)
        .attr('r',5)
        
        
    }
    
    d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
    .then((data)=>{
      console.log(data)
        render(data)
    })