<script>
  import { onMount, onDestroy } from 'svelte';
  import { base } from '$app/paths';
  import * as d3 from 'd3';

  export let year = 1920;

  // elements & dimensions
  let container;
  let svgElement;
  let data = [];
  let width = 0;
  let height = 0;
  const margin = { top: 20, right: 20, bottom: 200, left: 60 };

  // build the CSV URL using the same `base` your pages use
  const csvPath = `${base}/data/race_by_decade.csv`;

  // recalc on resize
  function updateDimensions() {
    if (!container) return;
    const rect = container.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
  }

  onMount(async () => {
    // 1) set initial size & listen for future resizes
    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    // 2) fetch your CSV at runtime from /static/data/…
    const res = await fetch(csvPath);
    const text = await res.text();
    data = d3.csvParse(text, d => ({
      year: +d.YEAR,
      category: d.category,
      value: +d.value
    }));
  });

  onDestroy(() => {
    window.removeEventListener('resize', updateDimensions);
  });

  // whenever data, year, or size changes, redraw
  $: filteredData = data.filter(d => d.year === year && d.value > 0);
  $: if (filteredData.length && width && height) {
    drawChart();
  }

  function drawChart() {
    if (!svgElement || !filteredData.length) return;

    const svg = d3.select(svgElement)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove();

    const innerWidth  = width  - margin.left - margin.right;
    const innerHeight = height - margin.top  - margin.bottom;

    // X scale
    const x = d3.scaleBand()
      .domain(filteredData.map(d => d.category))
      .range([0, innerWidth])
      .padding(0.1)

    // Y scale fixed 0 → 1,500,000
    const y = d3.scaleLinear()
      .domain([0, 1500000])     // ← fixed top
      .range([innerHeight, 0]);

    const colorMap = {
      'White': '#F97B72',
      'Black': '#F2B701',
      'Black or African American': '#F2B701',
      'Non-White':'#F2B701',
      'Other Race': '#3969AC',
      'Indian, Chinese, Japanese or Other Race': '#11A579',
      'Indian, Chinese, Japanese or Filipino':'#11A579',
      'Asian and Pacific Islander': '#11A579',
      'Asian': '#11A579',
      'American Indian, Eskimo, Aleut': '#CA73C6',
      'American Indian and Alaska Native': '#CA73C6',
      'American Indian ': '#CA73C6',
      'Two or more races ': '#7F3C8D',
      'Native Hawaiian and Other Pacific Islander': '#D05D02',
    };

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // horizontal gridlines
    g.append('g')
  .selectAll('line')
  .data(y.ticks(6))
  .join('line')
    .attr('x1', 0)
    .attr('x2', innerWidth)
    .attr('y1', d => y(d))
    .attr('y2', d => y(d))
    .attr('stroke', '#E5E5E5')  // Light grey for grid lines
    .attr('stroke-opacity', 0.3)  // Reduce opacity for softer lines
    .attr('stroke-width', 1)  // Thin lines for a subtle effect
    .attr('stroke-dasharray', '2,2');

    //tooltip

        const tooltip = d3.select('body')
  .append('div')
  .attr('class', 'tooltip')
  .style('position', 'absolute')
  .style('opacity', 0)  // Set initial opacity to 0 (invisible)
  .style('background-color', 'rgba(0, 0, 0, 0.85)')  // Slightly darker background
  .style('color', '#fff')
  .style('padding', '10px 15px')  // Increased padding for better readability
  .style('border-radius', '8px')  // Rounded corners
  .style('font-size', '13px')     // Larger font size for better readability
  .style('font-family', 'Helvetica')  // Modern font family
  .style('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.2)')  // Subtle shadow
  .style('transition', 'opacity 0.2s ease')  // Smooth opacity transition for fade-in/out
  .style('pointer-events', 'none')
  .style('z-index', '10');

    // bars
    g.append('g')
      .selectAll('rect')
      .data(filteredData)
      .join('rect')
        .attr('x', d => x(d.category))
        .attr('y', d => y(d.value))
        .attr('width', x.bandwidth())
        .attr('height', d => innerHeight - y(d.value))
        .attr('fill', d => colorMap[d.category] || '#888')
        .on('mouseover', function(event, d) {
          tooltip.transition()
            .duration(200)
            .style('opacity', 1);  // Make tooltip visible
          tooltip.html(`${d.category}: ${d.value}`)  // Show percentage
            .style('left', (event.pageX + 5) + 'px')  // Position tooltip to the right of the mouse
            .style('top', (event.pageY + 5) + 'px');  // Position tooltip below the mouse
        })
        .on('mousemove', function(event) {
          tooltip.style('left', (event.pageX + 5) + 'px')
            .style('top', (event.pageY + 5) + 'px');  // Update tooltip position with the mouse
        })
        .on('mouseout', function() {
          tooltip.transition()
            .duration(200)
            .style('opacity', 0);  // Hide tooltip on mouseout
        });

    // X axis + 45° labels
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
        .attr('transform', 'rotate(-40)')
        .style('text-anchor', 'end')
        .style('font-size', '13px') // Set font size for x-axis labels
        .style('font-family', 'Helvetica')
        .style('fill', '#fff')
        .attr('dx', '-0.5em')
        .attr('dy', '0.25em');

    // Y axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(6))
      .selectAll('text')
        .style('font-size', '11px') // Set font size for y-axis labels
        .style('font-family', 'Helvetica')
        .style('fill', '#fff')


      svg.append('text')
  .attr('x', - (height /2000))  // Position the label at the center of the Y axis (adjust the positioning)
  .attr('y', margin.left-50)  // Positioning the label at the top of the Y axis (above the axis)
  .style('text-anchor', 'right')
  .style('font-size', '14px')
  .style('font-family', 'Helvetica')
  .style('fill', '#fff')
  .text('Total Population');

  }
</script>

<div bind:this={container} class="chart-container">
  <p>Data source: Social Explorer, U.S. Decennial Census</p>
  <div style="margin-top: 2rem;"></div>
  <h1>Racial Demographics in Middlesex County for {year}</h1>
  <svg bind:this={svgElement}></svg>
</div>

<style>
  .chart-container {
    width: 100%;
    height: 300px;             /* give more vertical room */
    padding: 0.5rem;
    border-radius: 8px;
    box-sizing: border-box;
  }

  .chart-container p{
font-family: helvetica;
font-size: 80%;
font-style: italic;
color: darkgrey;
  }

  :global(svg) {
    width: 100%;
    height: 100%;
    display: block;
  }

  :global(.grid) {
    stroke: #eee;
  }

  :global(rect) {
    transition: fill 0.3s;
  }

  :global(rect:hover) {
  /* Adding a shadow effect on hover */
  filter: drop-shadow(0 4px 6px rgba(37, 37, 37, 0.3));  /* Shadow effect */
  stroke: #faf2f2;  /* Border color */
  stroke-width: 2px;  /* Border thickness */
  opacity: 1;  /* Full opacity on hover */
  transition: opacity 0.2s ease, transform 0.2s ease;  /* Smooth transition */
}

:global(rect) {
  opacity: 0.7;  /* Default opacity for other bars */
  transition: opacity 0.2s ease;
}

:global(rect.hover) {
  opacity: 2;  /* Full opacity for the hovered bar */
}

  :global(.tooltip) {
    pointer-events: none;
    position: absolute;
    opacity: 0;
    background-color: rgba(126, 123, 123, 0.85);
    color: #fff;
    padding: 10px 15px;
    border-radius: 8px;
    font-size: 14px;
    font-family: 'Helvetica';
    box-shadow: 0 4px 6px rgba(190, 48, 48, 0.2);
    transition: opacity 0.2s ease;
  }

  :global(.tooltip::before) {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.85) transparent transparent transparent;
  }

  h1{
    font-size: 1rem;
    margin-right: 10px;
    font-size: 100%;
    font-family: Helvetica;
    color: #eee;
  }
</style>
