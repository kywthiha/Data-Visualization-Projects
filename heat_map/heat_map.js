const render = (data) => {
    const template = "#heat_map"
    const dataset = data.monthlyVariance
    const baseTemperature = data.baseTemperature
    const width = 900
    const height = 450
    const margin = { top: 5, bottom: 80, left: 80, right: 50 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.bottom - margin.top
    const tooltipLabel = (d, i) => (`${d.year},${d3.timeFormat("%B")(new Date(1970, d.month - 1, 1, 0))} <br>Temp: <i>${(d.variance + data.baseTemperature).toFixed(2)}</i><br>
  <strong>Variance : ${d.variance.toFixed(2)}</strong>
  `)

    const svg = d3.select(template)
        .append('svg')
        .attr("viewBox", `0 0 ${width} ${height}`)
    const colorRule = d3.schemeCategory10

    const color = d3.scaleOrdinal(colorRule)

    const xScale = d3.scaleBand()
        .domain(dataset.map((d, i) => d.year))
        .range([0, innerWidth])

    const yScaleBand = d3.scaleBand()
        .domain(d3.range(0, 12, 1))
        .range([innerHeight, 0])

    const xAxis = d3.axisBottom(xScale)
        .tickValues(xScale.domain().filter((d, i) => (d % 10 === 0)));

    svg.append("g")
        .attr("transform", `translate(${margin.left},${innerHeight+margin.top})`)
        .attr('id', 'x-axis')
        .call(xAxis);

    const yAxis = d3.axisLeft(yScaleBand)
        .tickFormat((d, i) => {
            return d3.timeFormat("%B")(new Date(1970, d, 1, 0));
        });

    svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .attr('id', 'y-axis')
        .call(yAxis);

    const Tooltip = d3.select(template)
        .append("div")
        .style("opacity", 0)
        .attr('id', 'tooltip')
        .attr("class", "tooltip")

    const mouseover = function(d, i) {
        Tooltip
            .html(tooltipLabel(d, i))
            .attr('data-year', d.year)
            .style("opacity", 1)
        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1)
    }
    const mousemove = function(d) {
        Tooltip
            .style("left", (d3.event.pageX) + 10 + "px")
            .style("top", (d3.event.pageY) - 3 + "px")
    }
    const mouseleave = function(d) {
        Tooltip
            .style("opacity", 0)
        d3.select(this)
            .style("stroke", "none")
            .style("opacity", 0.8)
    }

    const reactGroup = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)
    reactGroup.selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('class', 'cell')
        .attr('width', xScale.bandwidth())
        .attr('data-month', (d, i) => d.month - 1)
        .attr('data-year', (d, i) => d.year)
        .attr('data-temp', (d, i) => d.variance)
        .attr('height', (d, i) => yScaleBand.bandwidth())
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .attr('x', (d, i) => xScale(d.year))
        .attr('y', (d, i) => yScaleBand(d.month - 1))
        .style('fill', (d, i) => color(d.variance))

    const eduextent = d3.extent(dataset.map((d, i) => d.variance))
    const colorScale = d3.scaleThreshold()
        .domain(d3.range(eduextent[0], eduextent[1], (eduextent[1] - eduextent[0]) / color.range().length))
        .range(colorRule);

    const colorLegend = svg.append('g')
        .attr('id', 'legend')
        .attr('transform', `translate(${margin.left},${innerHeight+margin.top+20})`)

    const legnedHeight = 30

    const colorScaleLinear = d3.scaleLinear()
        .domain([0, colorScale.range().length])
        .rangeRound([10, 300])

    colorLegend.append("g")
        .selectAll("rect")
        .data(colorScale.range())
        .join("rect")
        .attr("x", (d, i) => colorScaleLinear(i - 1))
        .attr("width", (d, i) => colorScaleLinear(i) - colorScaleLinear(i - 1))
        .attr("height", legnedHeight)
        .attr("fill", (d, i) => d);

    const axisBootom = d3.axisBottom(colorScaleLinear)
        .tickSize(-legnedHeight)
        .tickValues(d3.range(0, colorScale.domain().length))
        .tickFormat((d, i) => `${Math.round(colorScale.domain()[i]+baseTemperature)}(${Math.round(colorScale.domain()[i])})`)

    colorLegend.append('g')
        .attr('transform', `translate(${0},${legnedHeight})`)
        .call(axisBootom)
        .select('.domain').remove()
}

const DATA_URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
d3.json(DATA_URL).then((data) => {
    render(data)
})