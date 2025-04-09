<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { selectedCity, geoDataStore, cityList } from '../stores/state.js';

  // Chart dimensions and margins
  const width = 400;
  const height = 140; // a bit taller to accommodate labels below the bars
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };

  let svgEl;

  // Load GeoJSON once component mounts
  onMount(async () => {
    try {
      const data = await d3.json('/data/ACSDATA2023SORTED_GeoJSON.geojson');
      geoDataStore.set(data);

      // Build unique city list
      const cities = data.features.map(f => f.properties.j_CITY_NAME);
      cityList.set([...new Set(cities)]);
    } catch (error) {
      console.error('Error loading geoJSON:', error);
    }
  });

  // Reactive: find the current feature for the selected city
  $: currentFeature =
    $geoDataStore && $selectedCity
      ? $geoDataStore.features.find(
          f => f.properties.j_CITY_NAME.trim() === $selectedCity.trim()
        )
      : null;

  // Redraw the pyramid chart when data is ready
  $: if (currentFeature && svgEl) {
    drawChart(currentFeature);
  }

  /**
   * Draws a pyramid chart with bars extending to the left/right
   * from a central vertical line. Both bar length and color
   * encode the ownership percentage.
   */
  function drawChart(feature) {
    // Property keys for Non-White / White ownership rates
    const leftKey = 'j_NON_WHITE OWNER RATE';
    const rightKey = 'j_WHITE OWNER_RATE';

    // Extract numeric values (e.g. 0.3 for 30%)
    const nonWhiteVal = +feature.properties[leftKey] || 0;
    const whiteVal = +feature.properties[rightKey] || 0;
    const maxVal = d3.max([nonWhiteVal, whiteVal]);

    // Available drawing space
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Each half of the pyramid
    const halfWidth = innerWidth / 2;

    // Bar dimensions and positions
    const barHeight = 30;
    const barY = (innerHeight - barHeight) / 2; // center vertically

    // Color scale: from white (low) to dark blue (high)
    // If your data is in [0..1], this will start near white at 0
    // and dark blue at the highest rate.
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, maxVal]);

    // Scale for bar lengths
    const xScale = d3.scaleLinear()
      .domain([0, maxVal])
      .range([0, halfWidth]);

    // Clear previous chart
    const svg = d3.select(svgEl).selectAll('*').remove();

    // Create a main group element
    const g = d3.select(svgEl)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Center line (divider)
    const centerX = halfWidth;

    // Compute bar widths
    const leftBarWidth = xScale(nonWhiteVal);
    const rightBarWidth = xScale(whiteVal);

    // LEFT BAR (Non-White): extends leftward from center
    g.append('rect')
      .attr('x', centerX - leftBarWidth)
      .attr('y', barY)
      .attr('width', leftBarWidth)
      .attr('height', barHeight)
      .attr('fill', colorScale(nonWhiteVal));

    // RIGHT BAR (White): extends rightward from center
    g.append('rect')
      .attr('x', centerX)
      .attr('y', barY)
      .attr('width', rightBarWidth)
      .attr('height', barHeight)
      .attr('fill', colorScale(whiteVal));

    // Center dividing line
    g.append('line')
      .attr('x1', centerX)
      .attr('x2', centerX)
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#000');

    // Descriptive labels
    const nonWhiteLabel = `Non-White: ${(nonWhiteVal * 100).toFixed(2)}%`;
    const whiteLabel = `White: ${(whiteVal * 100).toFixed(2)}%`;

    // Place text labels BELOW each bar to prevent overlap
    // We anchor them in the middle of the bar horizontally.
    const labelOffset = 14; // vertical gap below the bar

    // LEFT LABEL
    g.append('text')
      // Middle of the bar horizontally
      .attr('x', centerX - leftBarWidth*1.1)
      .attr('y', barY + barHeight + labelOffset)
      .attr('text-anchor', 'middle')
      .attr('fill', '#333')
      .style('font-size', '12px')
      .text(nonWhiteLabel);

    // RIGHT LABEL
    g.append('text')
      .attr('x', centerX + rightBarWidth/2)
      .attr('y', barY + barHeight + labelOffset)
      .attr('text-anchor', 'middle')
      .attr('fill', '#333')
      .style('font-size', '12px')
      .text(whiteLabel);
  }
</script>

<!-- City Selector -->
<div class="selection">
  <label for="city-select">Select a City:</label>
  <select id="city-select" bind:value={$selectedCity}>
    <option value="">-- Choose a city --</option>
    {#each $cityList as city}
      <option value={city}>{city}</option>
    {/each}
  </select>
</div>

<!-- Pyramid Chart Container -->
{#if currentFeature}
  <div class="bargraph-container">
    <h2>{currentFeature.properties.j_CITY_NAME} Homeownership Rates</h2>
    <svg bind:this={svgEl} width={width} height={height}></svg>
  </div>
{:else}
  <p>Please select a city to see its owner rate data.</p>
{/if}

<style>
  .selection {
    margin-bottom: 20px;
    text-align: center;
  }
  label {
    font-size: 1rem;
    margin-right: 10px;
  }
  select {
    font-size: 1rem;
    padding: 5px;
  }
  .bargraph-container {
    padding: 10px;
    border: 1px solid #ccc;
    margin-top: 20px;
    text-align: center;
  }
</style>
