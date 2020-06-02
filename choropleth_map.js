const render = ({usgeo,usEdu,edu})=>{
    const width = 1000
    const height = 1000
    const template = "#scatterplot_graph"
    const margin = { top :50 , bottom : 60 , left: 80 , right : 50 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.bottom - margin.top

    const svg = d3.select(template).append('svg')
    svg.attr("viewBox", [0, 0, width, height])
    const colorScale = d3.scaleOrdinal();
    colorScale.domain(d3.range(1,10,1))
    .range(d3.schemeBlues[9])
    const colorValue = (d,i) => colorScale(usEdu[d.id].bachelorsOrHigher)
    const eduValue = (d,i) =>usEdu[d.id];

    // const axisBootom = d3.axisBottom(colorScale)
    // .ticks(5)
    // .tickSize(-innerHeight)
    // .tickPadding(8)
    // .tickSizeOuter(0)

    // svg.append('g')
    // .attr('transform',`translate(${20},${20})`)
    // .call(axisBootom)

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
    const mapgroups = svg.append('g').attr('class','map').attr('width',100)
    mapgroups.selectAll("path")
        .data(usgeo.features)
        .enter().append("path")
        .attr("d", path)
        .attr("width", width)
        .attr("height", height)
        .attr('fill',(d,i)=>(colorValue(d,i)))
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

const ready = (error,edu,us)=>{
    console.log("hi")
    alert("HI")
    console.log(edu)
    console.log(us)
}
Promise.all([
    d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"),
    d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json")
]).then(([edu,us])=>{
    console.log("start")
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
    for(let i = 0;i<10;i++){
        console.log(usEdu[usgeo.features[i].id])
    }
    console.log("end")
    render({usgeo,usEdu,edu})
})
