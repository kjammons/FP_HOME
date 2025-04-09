<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { selectedCity, geoDataStore, cityList } from '../stores/state.js';
  import { createBarChartScale } from '../utils/chartScales.js';
  import { chartDimensions, barStyle, centerLineStyle, textStyle } from '../utils/chartStyles.js';

  const { width, height, margin } = chartDimensions;
  let svgEl;

  // Load GeoJSON once component mounts
  onMount(async () => {
    try {
      const data = await d3.json('./data/ACSDATA2023SORTED_GeoJSON.geojson');
      geoDataStore.set(data);
      const cities = data.features.map(f => f.properties.j_CITY_NAME);
      cityList.set([...new Set(cities)]);
    } catch (error) {
      console.error('Error loading geoJSON:', error);
    }
  });

  // Reactive: create a bar chart–specific color scale,
  // using the keys specific to the pyramid chart.
  $: barChartColorScale =
    $geoDataStore && $geoDataStore.features
      ? createBarChartScale($geoDataStore.features, 'j_NON_WHITE OWNER RATE', 'j_WHITE OWNER_RATE')
      : null;

  // Reactive: find the current feature for the selected city
  $: currentFeature =
    $geoDataStore && $selectedCity
      ? $geoDataStore.features.find(
          f => f.properties.j_CITY_NAME.trim() === $selectedCity.trim()
        )
      : null;

  // Redraw the pyramid chart when data is ready and the bar chart scale exists
  $: if (currentFeature && svgEl && barChartColorScale) {
    drawChart(currentFeature);
  }

  function drawChart(feature) {
    const leftKey = 'j_NON_WHITE OWNER RATE';
    const rightKey = 'j_WHITE OWNER_RATE';

    const nonWhiteVal = +feature.properties[leftKey] || 0;
    const whiteVal = +feature.properties[rightKey] || 0;
    const maxVal = d3.max([nonWhiteVal, whiteVal]);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const halfWidth = innerWidth / 2;
    const { barHeight, labelOffset } = barStyle;
    const barY = (innerHeight - barHeight) / 2;

    const xScale = d3.scaleLinear()
      .domain([0, maxVal])
      .range([0, halfWidth]);

    d3.select(svgEl).selectAll('*').remove();
    const g = d3.select(svgEl)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const centerX = halfWidth;
    const leftBarWidth = xScale(nonWhiteVal);
    const rightBarWidth = xScale(whiteVal);

    // Draw left bar using barChartColorScale
    g.append('rect')
      .attr('x', centerX - leftBarWidth)
      .attr('y', barY)
      .attr('width', leftBarWidth)
      .attr('height', barHeight)
      .attr('fill', barChartColorScale(nonWhiteVal));

    // Draw right bar using barChartColorScale
    g.append('rect')
      .attr('x', centerX)
      .attr('y', barY)
      .attr('width', rightBarWidth)
      .attr('height', barHeight)
      .attr('fill', barChartColorScale(whiteVal));

    // Draw center divider
    g.append('line')
      .attr('x1', centerX)
      .attr('x2', centerX)
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', centerLineStyle.stroke);

    // Create labels
    const nonWhiteLabel = `Non-White: ${(nonWhiteVal * 100).toFixed(2)}%`;
    const whiteLabel = `White: ${(whiteVal * 100).toFixed(2)}%`;

    g.append('text')
      .attr('x', centerX - leftBarWidth * 1.1)
      .attr('y', barY + barHeight + labelOffset)
      .attr('text-anchor', textStyle.textAnchor)
      .attr('fill', textStyle.fill)
      .style('font-size', textStyle.fontSize)
      .text(nonWhiteLabel);

    g.append('text')
      .attr('x', centerX + rightBarWidth / 2)
      .attr('y', barY + barHeight + labelOffset)
      .attr('text-anchor', textStyle.textAnchor)
      .attr('fill', textStyle.fill)
      .style('font-size', textStyle.fontSize)
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
