const render = (data) => {

    const template = "#tree_map"
    const dValue = (d, i) => (+d.value)
    const dName = (d, i) => d.data.name
    const dCategory = (d, i) => d.data.category
    const clipUid = (d, i) => (d.clip_id = 'clip_' + i)
    const reactUid = (d, i) => (d.react_id = "react_" + i)
    const tooltipLabel = (d, i) => (`${d.data.category}<br> ${d.data.name} <br>${d.value}`)
    const margin = { top: 10, right: 10, bottom: 50, left: 10 },
        width = 900 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;

    const Tooltip = d3.select(template)
        .append("div")
        .style("opacity", 0)
        .attr('id', 'tooltip')
        .attr("class", "tooltip")

    const mouseover = function (d, i) {

        Tooltip
            .html(tooltipLabel(d, i))
            .attr('data-value', dValue(d, i))
            .style("opacity", 1)

        d3.select(this)
            .style("stroke", "#205493")
    }
    const mousemove = function (d) {
        Tooltip
            .style("left", (d3.event.pageX) + 10 + "px")
            .style("top", (d3.event.pageY) - 3 + "px")
    }
    const mouseleave = function (d) {
        Tooltip
            .style("opacity", 0)
        d3.select(this)
            .style("stroke", "none")
    }

    const svg = d3.select(template)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    const tree_map_g = svg.append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    const root = d3.hierarchy(data)
        .sum(dValue)
        .sort((a, b) => +b.value - +a.value)

    d3.treemap()
        .size([width, height])
        .padding(1)
        (root)

    const color = d3.scaleOrdinal(d3.schemeCategory10)

    const tree_map_leaf = tree_map_g.selectAll("g")
        .data(root.leaves())
        .enter()
        .append("g")
        .attr("transform", d => `translate(${d.x0},${d.y0})`)
        .on('mouseover', mouseover)
        .on('mouseleave', mouseleave)
        .on('mousemove', mousemove)
    const dValues = []
    tree_map_leaf.append("rect")
        .attr('class', 'tile')
        .attr('data-name', dName)
        .attr('data-value', (d, i) => dValue(d, i))
        .attr('data-category', dCategory)
        .attr('id', reactUid)
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .attr("fill-opacity", 0.6)
        .style("fill", (d, i) => {
            while (d.depth > 1)
                d = d.parent;
            if (dValues.indexOf(d.data.name) === -1) {
                dValues.push(d.data.name)
            }
            return color(d.data.name);
        });

    tree_map_leaf.append("clipPath")
        .attr("id", clipUid)
        .append("use")
        .attr("xlink:href", (d, i) => ('#' + d.react_id));

    tree_map_leaf.append("text")
        .attr("clip-path", d => (`url(#${d.clip_id})`))
        .selectAll("tspan")
        .data(d => (d.data.name.split(/(?=[A-Z][a-z])+/g)))
        .enter()
        .append("tspan")
        .attr("x", 3)
        .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
        .style('fill', '#112E51')
        .text(d => d);

    const legnedHeight = 30
    const colorLegend = svg.append('g')
        .attr('id', 'legend')
        .attr('transform', `translate(${margin.left},${height + 15})`)

    const colorScaleLinear = d3.scaleBand()
        .domain(dValues)
        .rangeRound([0, height])
        .padding(0.05)

    colorLegend.append("g")
        .selectAll("rect")
        .data(dValues)
        .enter()
        .append("rect")
        .attr('class', 'legend-item')
        .attr("x", colorScaleLinear)
        .attr("width", colorScaleLinear.bandwidth())
        .attr("height", legnedHeight)
        .attr("fill", color)

    const axisBootom = d3.axisBottom(colorScaleLinear)
        .tickSize(0)

    colorLegend.append('g')
        .attr('transform', `translate(${0},${legnedHeight})`)
        .call(axisBootom)
        .select('.domain').remove()
}

d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json', function (data) {

    render(data)

})