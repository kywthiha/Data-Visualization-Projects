const render = ({usgeo,usEdu,edu})=>{
    const width = 1000
    const height = 1000
    const template = "#scatterplot_graph"
    const margin = { top :50 , bottom : 60 , left: 80 , right : 50 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.bottom - margin.top

    const svg = d3.select(template).append('svg')
    svg.attr("viewBox", [0, 0, width, height])
    const eduextent = d3.extent(edu.map((d,i)=>d.bachelorsOrHigher))

    const colorScale = d3.scaleThreshold().
        domain(d3.range(eduextent[0], eduextent[1], (eduextent[1] - eduextent[0]) / 9)).
        range(d3.schemeGreens[9]);

    const colorValue = (d,i) => colorScale(usEdu[d.id].bachelorsOrHigher)
    const eduValue = (d,i) =>usEdu[d.id];

    const colorLegend = svg.append('g')
    .attr('id','legend')
    .attr('transform',`translate(${width-420},${10})`)
    const legnedHeight = 30

    const colorScaleLinear = d3.scaleLinear()
    .domain([-1, colorScale.range().length - 1])
    .rangeRound([10, 300])

    colorLegend.append("g")
      .selectAll("rect")
      .data(colorScale.range())
      .join("rect")
        .attr("x", (d,i)=>colorScaleLinear(i-1))
        .attr("width", (d,i)=>colorScaleLinear(i)-colorScaleLinear(i-1))
        .attr("height", legnedHeight)
        .attr("fill", (d,i)=>d);

        const axisBootom = d3.axisBottom(colorScaleLinear)
        .tickSize(-legnedHeight)
        .tickValues(d3.range(-1,colorScale.domain().length-1)) 
        .tickFormat((d,i)=>Math.round(colorScale.domain()[i])+"%")
    
        colorLegend.append('g')
        .attr('transform',`translate(${0},${legnedHeight})`)
        .call(axisBootom)
        .select('.domain').remove()

    const tooltipLabel = (d,i)=>{
        const eduEach = eduValue(d,i)
        return `${eduEach.area_name} <br>  ${eduEach.bachelorsOrHigher}%, ${eduEach.state}`
    }

    const Tooltip = d3.select(template)
    .append("div")
    .style("opacity", 0)
    .attr('id','tooltip')
    .attr("class", "tooltip")
    
    const mouseover = function(d,i) {
     
      Tooltip
        .html(tooltipLabel(d,i))
        .attr('data-education',eduValue(d,i).bachelorsOrHigher)
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
        .style("stroke", "steelblue")
        .style("opacity", 0.8)
    }

    const path = d3.geoPath();
    const mapgroups = svg.append('g')
    .attr('class','map')
    .attr('width',100)

    mapgroups.selectAll("path")
        .data(usgeo.features)
        .enter().append("path")
        .attr("d", path)
        .attr('class','county')
        .attr('fill',(d,i)=> colorValue(d,i))
        .attr('data-fips',(d,i)=>d.id)
        .attr('data-education',(d,i)=>eduValue(d,i).bachelorsOrHigher)
        .attr('stroke-width',0.1)
        .attr('stroke','steelblue')
        .on('mouseover',mouseover)
        .on('mouseleave',mouseleave)
        .on('mousemove',mousemove)

    svg.call(d3.zoom()
    .on("zoom", () => {
        mapgroups.attr("transform", d3.event.transform);
    }));


}

Promise.all([
    d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"),
    d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json")
]).then(([edu,us])=>{
    const usgeo = topojson.feature(us, us.objects.counties)
    const usEdu = edu.reduce((acc,d)=>{
        acc[d.fips] = {
            area_name: d.area_name,
            bachelorsOrHigher: d.bachelorsOrHigher,
            fips: d.fips,
            state: d.state
        }
        return acc;
    },{})
    
    render({usgeo,usEdu,edu})
})
