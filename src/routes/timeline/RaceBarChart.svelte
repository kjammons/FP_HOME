<!-- src/lib/components/RaceBarChart.svelte -->
<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  export let year = 1920;
  export let csvPath = 'src/lib/assets/data/race_by_decade.csv';

  let container;
  let svgElement;
  let data = [];
  let width = 0;
  let height = 0;

  // increased bottom margin to make room for 45° labels
  const margin = { top: 20, right: 20, bottom: 80, left: 60 };

  onMount(async () => {
    const csv = await d3.csv(csvPath, d => ({
      year: +d.YEAR,
      category: d.category,
      value: +d.value
    }));
    data = csv;
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
  });

  $: filteredData = data.filter(d => d.year === year && d.value > 0);
  $: if (filteredData.length && width && height) {
    drawChart();
  }

  function updateDimensions() {
    if (!container) return;
    const rect = container.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
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
      .padding(0.1);

    // Y scale fixed 0 → 1,500,000
    const y = d3.scaleLinear()
      .domain([0, 1500000])     // ← fixed top
      .range([innerHeight, 0]);

    const colorMap = {
      'White': '#F97B72',
      'Black': '#F2B701',
      'Black or African American': '#F2B701',
      'Other Race': '#3969AC',
      'Indian, Chinese, Japanese or Other Race': '#11A579',
      'Asian and Pacific Islander': '#11A579',
      'Asian': '#11A579',
      'American Indian, Eskimo, Aleut': '#CA73C6',
      'American Indian and Alaska Native': '#CA73C6',
      'Two or more races': '#7F3C8D',
      'Native Hawaiian and Other Pacific Islander': '#D05D02'
    };

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // horizontal gridlines
    g.append('g')
      .selectAll('line')
      .data(y.ticks(6))
      .join('line')
        .attr('class', 'grid')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', d => y(d))
        .attr('y2', d => y(d));

    // bars
    g.append('g')
      .selectAll('rect')
      .data(filteredData)
      .join('rect')
        .attr('x', d => x(d.category))
        .attr('y', d => y(d.value))
        .attr('width', x.bandwidth())
        .attr('height', d => innerHeight - y(d.value))
        .attr('fill', d => colorMap[d.category] || '#888');

    // X axis + 45° labels
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end')
        .attr('dx', '-0.5em')
        .attr('dy', '0.25em');

    // Y axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(6));
  }
</script>

<div bind:this={container} class="chart-container">
  <svg bind:this={svgElement}></svg>
</div>

<style>
  .chart-container {
    width: 100%;
    height: 350px;             /* give more vertical room */
    padding: 0.5rem;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    box-sizing: border-box;
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
    fill: #388E3C;
  }
</style>
