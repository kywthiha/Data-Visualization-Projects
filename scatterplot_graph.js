fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
  .then(response => response.json())
  .then(data => {
      const template = "#scatterplot_graph"
      console.log(data);
      const width = 800,height = 450,padding = 60
      const svg = d3.select(template)
      .append('svg')
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style('background-color','pink')
      


      const maxyear = d3.max(data,(d)=>d.Year)
      const minyear = d3.min(data,(d)=>d.Year)
      const maxtime = d3.max(data,(d)=>d.Seconds)
      const mintime = d3.min(data,(d)=>d.Seconds)

      const xScale = d3.scaleTime()
        .domain([new Date(minyear-1,0),new Date(maxyear+1,0)])
        .range([padding,width-padding])
      const xAxis = d3.axisBottom(xScale);

      svg.append("g")
        .attr("transform", `translate(0,${height-padding})`)
        .attr('id','x-axis')
        .call(xAxis);
      const timeminute = ({Seconds})=>{
          const temp = new Date(1970, 0, 1, 0)
          temp.setSeconds(Seconds)
          return temp
        }

        const yScale = d3.scaleTime()
        .domain([timeminute({Seconds:mintime}),timeminute({Seconds:maxtime})])
        .range([height-padding,padding])

        const yAxis = d3.axisLeft(yScale)
        .tickFormat((d,i)=>{
          return d3.timeFormat("%M:%S")(d);
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
          let str = ""
          if(d.hasOwnProperty('Name') && d.hasOwnProperty('Nationality') && d.hasOwnProperty('Year') && d.hasOwnProperty('Time')){
            if(d['Name'] && d['Nationality'] && d['Year']){
              str += d['Name'] +":"+d['Nationality']+"<br>"+ "Year : "+d['Year'] +","+"Time : "+d['Time']
            }
          }
          if(d.hasOwnProperty('Doping')){
            if(d['Doping']){
              str += `<br>Doping : <i style="color:blue">${d['Doping']}</i>`
            }
          }
          Tooltip
            .html(`${str}`)
            .attr('data-year',new Date(d.Year,0))
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

        svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('class','dot')
        .attr('data-xvalue',(d,i)=>{
          return new Date(d.Year,0)
        })
        .attr('data-yvalue',(d,i)=>{
          return timeminute({Seconds:d.Seconds});
        })
        .attr('cx',(d,i)=>xScale(new Date(d.Year,0)))
        .attr('cy',(d,i)=>{
          return yScale(timeminute({Seconds:d.Seconds}))
        })
        .attr('r',6)
        .style('fill',(d,i)=>(d.Doping ? 'blue':'red'))
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)


        svg.append('text')
        .text("Time in Minutes")
        .attr('transform','rotate(-90)')
        .attr('font-size',12)
        .attr('x',-height+150)
        .attr('y',padding-40)


        const legend = svg.append("g")
        .attr("id", 'legend')
        .attr("transform", `translate(${width-250},${height-150})`)
        console.log(legend)
        legend.append('text')
        .text('No doping allegations')
        .style('text-anchor','end')
        .attr('x',170)
        .attr('y',10)

        legend.append('rect')
        .attr('width',10)
        .attr('fill','red')
        .attr('height',10)
        .attr('x',172)
        .attr('y',0)

        legend.append('text')
        .text('Riders with doping allegations')
        .style('text-anchor','end')
        .attr('x',170)
        .attr('y',40)

        legend.append('rect')
        .attr('width',10)
        .attr('fill','blue')
        .attr('height',10)
        .attr('x',172)
        .attr('y',30)


       


  });