<!-- src/routes/timeline/HomeownBar.svelte -->
<script>
  import { onMount, onDestroy } from 'svelte';
  import { base } from '$app/paths';
  import * as d3 from 'd3';

  // the currently selected decade
  export let year = 1920;

  const notes = {
  1950: "1950 census reflects a binary classification of 'white' versus 'non-white', reinforcing 20th-century racial hierarchies and obscuring the distinct experiences of individual racial groups.",
  1970: "As a result of post-war policies aimed at spurring homeownership, 59% of Middlesex County households are owner-occupied, close to national average. But homeownership in Middlesex County was overwhelmingly limited to white residents due to a combination of discriminatory housing policies, lending practices, and local exclusionary zoning.",
  1990: "Asian population surpasses Black population- Following the Vietnam War, Cambodian genocide, and Laotian civil war, the U.S. accepted large numbers of refugees from Southeast Asia. Places like Lowell and Lynn, became key resettlement areas. White homeownership is 37% higher than Black homeownership, reflecting a growing trend of racial disparity in homeownership rate.",
  2010: "From 1980-2010, white homeownership increased by 8% percentage points when that of black households remained constant overtime (dropping at 25% in 1990).The total homeownership rate in Middlesex County aligns with both state and national trends, reaching 60%",
  2020:"In 2020, only about 5% of Middlesex County's population identified as Black or African American, compared to 25% in Suffolk County (Boston), underscoring how urban/suburban racial geographies in Massachusetts remain stark. "
};

  // build the URL at runtime
  const csvPath = `${base}/data/home_ownership_by_decade.csv`;

  // DOM refs & dimensions
  let container;
  let svgElement;
  let data = [];
  let width = 0;
  let height = 0;

  // margins for axes/labels
  const margin = { top: 20, right: 20, bottom: 200, left: 60 };

  // recalc chart size on window resize
  function updateSize() {
    if (!container) return;
    const rect = container.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
  }

  onMount(async () => {
    // 1) set initial size & listen for changes
    updateSize();
    window.addEventListener('resize', updateSize);

    // 2) fetch & parse the CSV at runtime
    const res = await fetch(csvPath);
    const text = await res.text();
    data = d3.csvParse(text, d => ({
      year:     +d.YEAR,
      category: d.Category.trim(),
      value:    +d.Value
    }));
  });

  onDestroy(() => {
    window.removeEventListener('resize', updateSize);
  });

  // whenever data, year, or size changes, redraw
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
    .style('font-size', '18px')
    .style('font-family', 'Helvetica')
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
      'Middlesex County Rate': '#92A0AD'
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
      .style('font-size', '13px')
      .style('font-family', 'Helvetica')
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
        .style('font-size', '13px')
        .style('font-family', 'Helvetica')
        .style('fill', '#fff')
        .attr('dx', '-0.5em')
        .attr('dy', '0.5em');

    // y-axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(6).tickFormat(d3.format('.0%')))
      .selectAll('text')
        .style('fill', '#fff')
        .style('font-size', '13px')
        .style('font-family', 'Helvetica');
  }


</script>

<div bind:this={container} class="chart-container">
  <h1>Homeownership Rate by Race in Middlesex County for {year}</h1>
  <svg bind:this={svgElement}></svg>
  {#if notes[year]}
  <div class="chart-note-box">
    <p>{notes[year]}</p>
  </div>
{/if}

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
    font-size: 100%;
    margin-bottom: 0.25rem;
    font-family: Helvetica;
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
    font-family: Helvetica;
    box-shadow: 0 4px 6px rgba(0,0,0,0.2);
    transition: opacity 0.2s ease;
  }

  .chart-caption {
  font-size: 0.9rem;
  font-style: italic;
  color: #ddd;
  font-family: Helvetica;
}

.chart-note-box {
  background-color: rgba(0, 0, 0, 0.7);
  padding: 0.75rem 1rem;
  border-left: 4px solid #A91B0D;
  color: #fff;
  font-style: italic;
  font-size: 0.95rem;
  font-family: Helvetica;
  max-width: 500px;
  margin-top: 0.5rem;
  border-radius: 6px;
}


</style>
