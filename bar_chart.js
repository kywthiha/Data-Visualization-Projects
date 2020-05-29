fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
  .then(response => response.json())
  .then(data => {
      const width = 800,height = 450,padding = 60
      const svg = d3.select('#bar_char')
      .append('svg')
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style('background-color','pink');

      svg
      .append('text')
      .text('Gross Domestic Product')
      .attr('x',-height/2)
      .attr('y',padding+30)
      .attr("transform", "rotate(-90)")

      svg
      .append('text')
      .text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf')
      .attr('x',width-padding*8)
      .attr('y',height-padding+40)

      const dataset = data.data
      const maxdate = d3.max(dataset,(d)=>d[0])
      const mindate = d3.min(dataset,(d)=>d[0])
      const maxgdp = d3.max(dataset,(d)=>d[1])
      const mingdp = d3.min(dataset,(d)=>d[1])

      const Tooltip = d3.select("#bar_char")
      .append("div")
      .style("opacity", 0)
      .attr('id','tooltip')
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")

      const mouseover = function(d) {
        Tooltip
          .style("opacity", 1)
          .attr('data-date',d[0])
        d3.select(this)
          .style("stroke", "black")
          .style("opacity", 1)
      }
      const mousemove = function(d) {
        Tooltip
          .html(`${new Date(d[0]).toDateString()}<br>$ ${d[1]} Billions`)
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

      const yScale = d3.scaleLinear()
      .domain([0,maxgdp])
      .range([height-padding,padding])

      const xScale = d3.scaleTime()
      .domain([new Date(mindate),new Date(maxdate)])
      .range([padding,width-padding])

      const yaxis = d3.axisLeft(yScale);
      svg.append("g")
      .attr('id',"y-axis")
      .attr("transform", `translate(${padding},0)`)
      .call(yaxis);

      const xAxis = d3.axisBottom(xScale);
      svg.append("g")
      .attr('id','x-axis')
       .attr("transform", "translate(0," + (height - padding) + ")")
       .call(xAxis);

       svg.selectAll("rect")
       .data(dataset)
       .enter()
       .append("rect")
       .attr("x", (d, i) => {
        const xs = xScale(new Date(d[0]))
        console.log(new Date(d[0]),xs)
        return xs
       })
       .attr("y", (d,i)=>(yScale(d[1])))
       .attr("width", 2)
       .attr("height", (d,i)=>{
         return height-padding-yScale(d[1])
       })
       .attr('class','bar')
       .attr('data-date',(d)=>d[0])
       .attr('data-gdp',(d)=>d[1])
       .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
      console.log(mindate,mingdp)
      console.log(maxdate,maxgdp)
  });