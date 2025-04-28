<!-- src/routes/timeline/HomeownBar.svelte -->
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

  // give even more bottom room for rotated labels
  const margin = { top: 20, right: 20, bottom: 200, left: 60 };

  onMount(async () => {
    data = await d3.csv(csvPath, d => ({
      year: +d.YEAR,
      category: d.Category.trim(),
      value: +d.Value
    }));
    window.addEventListener('resize', updateSize);
    updateSize();
  });

  function updateSize() {
    if (!container) return;
    const rect = container.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
  }

  // redraw anytime data, year, width or height changes
  $: if (data.length && width && height && year !== undefined) {
    drawChart();
  }

  function drawChart() {
    const svg = d3.select(svgElement)
      .attr('width', width)
      .attr('height', height);

    // 1) clear old content
    svg.selectAll('*').remove();

    const innerW = width  - margin.left - margin.right;
    const innerH = height - margin.top  - margin.bottom;

    // 2) grab all entries for this year
    const yearData = data.filter(d => d.year === year);

    // 3) filter out zero values
    const filtered = yearData.filter(d => d.value > 0);

// 4) if no data (all zeros or no rows), show wrapped message and stop
if (filtered.length === 0) {
  const msg = `Homeownership rates were not collected as part of the ${year} census in Middlesex County`;
  const boxW = innerW * 0.8;
  const boxH = 60;
  const boxX = margin.left + (innerW - boxW) / 2;
  const boxY = margin.top  + (innerH - boxH) / 2;

  // background box
  svg.append('rect')
    .attr('x', boxX)
    .attr('y', boxY)
    .attr('width', boxW)
    .attr('height', boxH)
    .attr('fill', 'rgba(0,0,0,0.6)')
    .attr('rx', 4)
    .attr('ry', 4);

  // helper to wrap text into tspans
  function wrapText(textSel, width) {
    textSel.each(function() {
      const text = d3.select(this);
      const words = text.text().split(/\s+/).reverse();
      let line = [], lineNumber = 0;
      const lineHeight = 1.2; // ems
      const x = text.attr('x');
      const y = text.attr('y');
      let tspan = text.text(null)
        .append('tspan')
        .attr('x', x)
        .attr('y', y)
        .attr('dy', '0em');

      while (words.length) {
        const word = words.pop();
        line.push(word);
        tspan.text(line.join(' '));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(' '));
          line = [word];
          tspan = text.append('tspan')
            .attr('x', x)
            .attr('y', y)
            .attr('dy', `${++lineNumber * lineHeight}em`)
            .text(word);
        }
      }
    });
  }

  // append the text element centered in the box
  const textEl = svg.append('text')
    .attr('x', margin.left + innerW / 2)
    .attr('y', margin.top  + innerH / 2 - boxH / 4)
    .attr('text-anchor', 'middle')
    .style('fill', '#fff')
    .style('font-size', '14px')
    .style('font-family', '"Segoe UI", sans-serif')
    .text(msg);

  // wrap it to the width of the box
  wrapText(textEl, boxW - 10);

  return;
}
    // scales
    const x = d3.scaleBand()
      .domain(filtered.map(d => d.category))
      .range([0, innerW])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, 1])
      .range([innerH, 0]);

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
      'American Indian': '#CA73C6',
      'Two or more races': '#7F3C8D',
      'Native Hawaiian and Other Pacific Islander': '#D05D02',
      'Total': '#92A0AD'
    };

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // gridlines
    g.append('g')
      .selectAll('line')
      .data(y.ticks(6))
      .join('line')
        .attr('x1', 0)
        .attr('x2', innerW)
        .attr('y1', d => y(d))
        .attr('y2', d => y(d))
        .attr('stroke', '#E5E5E5')
        .attr('stroke-opacity', 0.3)
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '2,2');

    // tooltip
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('opacity', 0)
      .style('background-color', 'rgba(0, 0, 0, 0.85)')
      .style('color', '#fff')
      .style('padding', '10px 15px')
      .style('border-radius', '8px')
      .style('font-size', '14px')
      .style('font-family', '"Segoe UI", sans-serif')
      .style('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.2)')
      .style('pointer-events', 'none')
      .style('transition', 'opacity 0.2s ease')
      .style('z-index', '10');

    // bars
    g.selectAll('rect')
      .data(filtered)
      .join('rect')
        .attr('x', d => x(d.category))
        .attr('y', d => y(d.value))
        .attr('width', x.bandwidth())
        .attr('height', d => innerH - y(d.value))
        .attr('fill', d => colorMap[d.category] || '#888')
        .on('mouseover', (event, d) => {
          tooltip.transition().duration(200).style('opacity', 1);
          tooltip
            .html(`${d.category}: ${Math.round(d.value * 100)}%`)
            .style('left', (event.pageX + 5) + 'px')
            .style('top', (event.pageY + 5) + 'px');
        })
        .on('mousemove', event => {
          tooltip
            .style('left', (event.pageX + 5) + 'px')
            .style('top', (event.pageY + 5) + 'px');
        })
        .on('mouseout', () => {
          tooltip.transition().duration(200).style('opacity', 0);
        });

    // x-axis
    g.append('g')
      .attr('transform', `translate(0,${innerH})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
        .attr('transform', 'rotate(-40)')
        .style('text-anchor', 'end')
        .style('font-size', '12px')
        .style('font-family', '"Segoe UI", sans-serif')
        .style('fill', '#fff')
        .attr('dx', '-0.5em')
        .attr('dy', '0.5em');

    // y-axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(6).tickFormat(d3.format('.0%')))
      .selectAll('text')
        .style('fill', '#fff')
        .style('font-size', '12px')
        .style('font-family', '"Segoe UI", sans-serif');
  }
</script>

<div bind:this={container} class="chart-container">
  <h1>Homeownership Rate by Race in Middlesex County for {year}</h1>
  <svg bind:this={svgElement}></svg>
</div>

<style>
  .chart-container {
    width: 100%;
    height: 300px;
    position: relative;
    overflow: visible;
    padding: 0.5rem;
    box-sizing: border-box;
  }
  svg { display: block; }
  h1 {
    font-size: 85%;
    margin-bottom: 0.25rem;
    font-family: 'Segoe UI', sans-serif;
    color: aliceblue;
  }
  :global(.tooltip) {
    pointer-events: none;
    position: absolute;
    opacity: 0;
    background-color: rgba(0,0,0,0.85);
    color: #fff;
    padding: 10px 15px;
    border-radius: 8px;
    font-size: 14px;
    font-family: 'Segoe UI', sans-serif;
    box-shadow: 0 4px 6px rgba(0,0,0,0.2);
    transition: opacity 0.2s ease;
  }
</style>
