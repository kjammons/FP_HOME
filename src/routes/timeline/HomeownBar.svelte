<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  export let year = 1920;
  export let csvPath = 'src/lib/assets/data/home_ownership_by_decade.csv';
  let data = [];

  let svgElement;
  let container;
  let width = 0;
  let height = 0;

  // give extra bottom room for rotated labels
  const margin = { top: 20, right: 20, bottom: 60, left: 60 };

  onMount(async () => {
    const csv = await d3.csv(csvPath, d => ({
      year: +d.YEAR,
      category: d.Category,
      value: +d.Value
    }));
    data = csv;
    window.addEventListener('resize', updateSize);
    updateSize();
  });

  $: filteredData = data.filter(d => d.year === year && d.value > 0);
  $: if (filteredData.length && width && height) drawChart();

  function updateSize() {
    if (!container) return;
    const rect = container.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    drawChart();
  }

  function drawChart() {
    if (!svgElement || !width || !height) return;

    const svg = d3.select(svgElement)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove();

    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const x = d3.scaleBand()
      .domain(filteredData.map(d => d.category))
      .range([0, innerW])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, 1])   // keep 0–1 scale
      .range([innerH, 0]);

    const colorMap = {
      'Total': "#AEAAAA",
      'White': '#F97B72',
      'Black': '#F2B701',
      // etc…
    };

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // horizontal gridlines
    g.append('g')
      .selectAll('line')
      .data(y.ticks(6))
      .join('line')
        .attr('x1', 0)
        .attr('x2', innerW)
        .attr('y1', d => y(d))
        .attr('y2', d => y(d))
        .attr('stroke', '#eee');

    // bars
    g.selectAll('rect')
      .data(filteredData)
      .join('rect')
        .attr('x', d => x(d.category))
        .attr('y', d => y(d.value))
        .attr('width', x.bandwidth())
        .attr('height', d => innerH - y(d.value))
        .attr('fill', d => colorMap[d.category] || '#888');

    // x-axis with 45° labels
    g.append('g')
      .attr('transform', `translate(0,${innerH})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end')
        .attr('dx', '-0.5em')
        .attr('dy', '0.5em');

    // y-axis as percentages
    g.append('g')
      .call(
        d3.axisLeft(y)
          .ticks(6)
          .tickFormat(d3.format(".0%"))
      );
  }
</script>

<div bind:this={container} class="chart-container">
  <svg bind:this={svgElement}></svg>
</div>

<style>
  .chart-container {
    width: 100%;
    height: 300px;        /* restored to 300px */
    position: relative;
    overflow: visible;    /* so rotated labels aren’t clipped */
    padding: 0.5rem;
    box-sizing: border-box;
  }

  svg {
    display: block;
  }
</style>
