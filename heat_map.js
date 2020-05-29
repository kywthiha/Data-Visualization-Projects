fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
  .then(response => response.json())
  .then(data => {
      const template = "#scatterplot_graph"
      console.log(data);
      const dataset = data.monthlyVariance;
      const width = 800,height = 350,padding = 60
      const svg = d3.select(template)
      .append('svg')
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style('background-color','pink')
      


      const maxyear = d3.max(dataset,(d)=>d.year)
      const minyear = d3.min(dataset,(d)=>d.year)
      const maxmonth = d3.max(dataset,(d)=>d.month)
      const minmonth = d3.min(dataset,(d)=>d.month)
      const minTemp = d3.min(dataset,(d)=>d.variance)+data.baseTemperature
      const maxTemp = d3.max(dataset,(d)=>d.variance)+data.baseTemperature

      const xScale = d3.scaleBand()
      .domain(dataset.map((d,i)=>d.year))
      .range([padding,width-padding])

      const montharr = ()=>{
        const arr = []
        for(let i=0;i<12;i++){
          arr.push(i)
        }
        return arr;
      }

      const yScaleBand = d3.scaleBand()
      .domain([...montharr()])
      .range([height-padding,padding])

      const xAxis = d3.axisBottom(xScale)
      .tickValues(xScale.domain().filter((d,i)=>(d%10===0)));

      svg.append("g")
        .attr("transform", `translate(0,${height-padding})`)
        .attr('id','x-axis')
        .call(xAxis);

        const yScale = d3.scaleTime()
        .domain([new Date(1970, minmonth-1,1 , 0),new Date(1970, maxmonth-1, 1, 0)])
        .range([height-padding,padding])

        const yAxis = d3.axisLeft(yScaleBand)
        .tickFormat((d,i)=>{
          return d3.timeFormat("%B")(new Date(1970, d,1 , 0));
        });
        svg.append("g")
        .attr("transform", `translate(${padding},0)`)
        .attr('id','y-axis')
        .call(yAxis);

        const Tooltip = d3.select(template)
        .append("div")
        .style("opacity", 0)
        .attr('id','tooltip')
        .attr("class", "tooltip")
  
        const mouseover = function(d) {
          Tooltip
            .html(`${d.year},${d3.timeFormat("%B")(new Date(1970, d.month-1,1 , 0))} <br>Temp: <i style="color:blue;">${(d.variance+data.baseTemperature).toFixed(2)}</i><br>
            <strong>Variance : <span style="color:blue;"> ${d.variance.toFixed(2)} </span></strong>
            `)
            .attr('data-year',d.year)
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

          
      const sequentialScale = d3.scaleSequential(d3.interpolateCubehelixDefault)
        .domain([minTemp,maxTemp]);
      svg.append("g")
      .attr('id','legend')
        .attr("class", "legendSequential")
        .attr("transform", `translate(${padding},${height-padding/2})`);
        const legendSequential = d3.legendColor()
          .shapeWidth(30)
          .shapeHeight(10)
          .cells(20)
          .orient("horizontal")
          .scale(sequentialScale) 

      svg.select(".legendSequential")
        .call(legendSequential);
                 

        svg.selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('class','cell')
        .attr('width',xScale.bandwidth())
        .attr('data-month',(d,i)=>d.month-1)
        .attr('data-year',(d,i)=>d.year)
        .attr('data-temp',(d,i)=>d.variance)
        .attr('height',(d,i)=>yScaleBand.bandwidth())
        .attr('x',(d,i)=>xScale(d.year))
        .attr('y',(d,i)=>{
          return yScaleBand(d.month-1)
        })
        .style('fill',(d,i)=>(sequentialScale(d.variance+data.baseTemperature)))
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

        

        

      
          



  });