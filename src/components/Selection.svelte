<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { selectedCity, geoDataStore, cityList } from '../stores/state.js';
  import { createBarChartScale } from '../utils/chartScales.js';
  import { chartDimensions, barStyle, centerLineStyle, textStyle } from '../utils/chartStyles.js';
  import { loadGeoJSON } from '../utils/mapUtils.js';
  import '../utils/tooltip.css';

  const { width, height, margin } = chartDimensions;
  
  // Remove map view container variable.
  // We'll only use two containers for the charts.
  let svgHomeownership;
  let svgPopulation;
  let geoData;

  // On mount, load GeoJSON data, update the shared store, and populate the dropdown.
  onMount(async () => {
    try {
      const data = await d3.json('./data/ACSDATA2023SORTED_GeoJSON.geojson');
      geoDataStore.set(data);
      geoData = data;
      
      // Extract unique city names, sorted alphabetically.
      const cities = data.features.map(f => f.properties.j_CITY_NAME);
      const uniqueCities = [...new Set(cities)].sort((a, b) => a.localeCompare(b));
      cityList.set(uniqueCities);
    } catch (error) {
      console.error('Error loading GeoJSON:', error);
    }
  });

  // Reactive: create the bar chart color scale (for the homeownership pyramid)
  $: barChartColorScale =
    $geoDataStore && $geoDataStore.features
      ? createBarChartScale($geoDataStore.features, 'j_NON_WHITE OWNER RATE', 'j_WHITE OWNER_RATE')
      : null;

  // Reactive: determine the current feature (city) from geoDataStore based on selectedCity.
  $: currentFeature =
    $geoDataStore && $selectedCity
      ? $geoDataStore.features.find(f =>
            f.properties.j_CITY_NAME.trim() === $selectedCity.trim())
      : null;

  // When a city is selected and the SVGs are present, draw the two charts.
  $: if (currentFeature && svgHomeownership && barChartColorScale) {
    drawHomeownershipChart(currentFeature);
  }
  $: if (currentFeature && svgPopulation) {
    drawPopulationChart(currentFeature);
  }

  // --- Homeownership Pyramid Chart ---
  function drawHomeownershipChart(feature) {
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
    
    // Clear previous drawing
    d3.select(svgHomeownership).selectAll('*').remove();
    const g = d3.select(svgHomeownership)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    const centerX = halfWidth;
    const leftBarWidth = xScale(nonWhiteVal);
    const rightBarWidth = xScale(whiteVal);
    
    // Draw left bar (Non-White Homeownership)
    g.append('rect')
      .attr('x', centerX - leftBarWidth)
      .attr('y', barY)
      .attr('width', leftBarWidth)
      .attr('height', barHeight)
      .attr('fill', barChartColorScale(nonWhiteVal));
    
    // Draw right bar (White Homeownership)
    g.append('rect')
      .attr('x', centerX)
      .attr('y', barY)
      .attr('width', centerX + rightBarWidth)
      .attr('height', barHeight)
      .attr('fill', barChartColorScale(whiteVal));
    
    // Draw center divider
    g.append('line')
      .attr('x1', centerX)
      .attr('x2', centerX)
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', centerLineStyle.stroke);
    
    // Create human‑readable labels for homeownership percentages.
    const nonWhiteLabel = `Non-White Homeownership: ${(nonWhiteVal * 100).toFixed(2)}%`;
    const whiteLabel = `White Homeownership: ${(whiteVal * 100).toFixed(2)}%`;
    
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

  // --- Population Pyramid Chart ---
  function drawPopulationChart(feature) {
    const whiteKey = "j_PROP_POP WHITE";
    const blackKey = "j_PROP_POP BLACK";
    const asianKey = "j_PROP_POP ASIAN";
    const indianKey = "j_PROP_POP AMERICAN INDIAN";
    const hawaiianKey = "j_PROP_POP NATIVE HAWAIIAN";
    
    const whitePop = +feature.properties[whiteKey] || 0;
    const blackPop = +feature.properties[blackKey] || 0;
    const asianPop = +feature.properties[asianKey] || 0;
    const indianPop = +feature.properties[indianKey] || 0;
    const hawaiianPop = +feature.properties[hawaiianKey] || 0;
    
    // Compute nonWhite population by summing the four values.
    const nonWhitePop = blackPop + asianPop + indianPop + hawaiianPop;
    const maxVal = d3.max([whitePop, nonWhitePop]);
    
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const halfWidth = innerWidth / 2;
    const { barHeight, labelOffset } = barStyle;
    const barY = (innerHeight - barHeight) / 2;
    
    const xScale = d3.scaleLinear()
      .domain([0, maxVal])
      .range([0, halfWidth]);
    
    // Clear previous drawing
    d3.select(svgPopulation).selectAll('*').remove();
    const g = d3.select(svgPopulation)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    const centerX = halfWidth;
    const leftBarWidth = xScale(nonWhitePop);
    const rightBarWidth = xScale(whitePop);

    
    // Draw left bar representing Non-White Population
    g.append('rect')
      .attr('x', centerX - leftBarWidth)
      .attr('y', barY)
      .attr('width', leftBarWidth)
      .attr('height', barHeight)
      .attr('fill', '#fdbf6f');
    
    // Draw right bar representing White Population
    g.append('rect')
      .attr('x', centerX)
      .attr('y', barY)
      .attr('width', centerX + rightBarWidth)
      .attr('height', barHeight)
      .attr('fill', '#cab2d6');
    
    // Draw center divider
    g.append('line')
      .attr('x1', centerX)
      .attr('x2', centerX)
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', centerLineStyle.stroke);
    
    
    const nonWhiteLabel = `Non-White Population: ${(nonWhitePop*100).toFixed(2)}%`;
    const whiteLabel = `White Population: ${(whitePop*100).toFixed(2)}%`;
    
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

<!-- Combined Container for Charts -->
<div class="combined-charts-container">
  {#if currentFeature}
    <div class="charts-container">
      <div class="population-chart-container">
        <h2>Racial Demographics for {currentFeature.properties.j_CITY_NAME}</h2>
        <svg bind:this={svgPopulation} width={width} height={height}></svg>
      </div>
    </div>
      <div class="bargraph-container">
        <h2>Homeownership Demographics for {currentFeature.properties.j_CITY_NAME} </h2>
        <svg bind:this={svgHomeownership} width={width} height={height}></svg>
      </div>
  {:else}
    <p>Please select a city to see its data.</p>
  {/if}
</div>

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
  .combined-charts-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 10px;
  }
  .charts-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    max-width: 900px;
  }
  .bargraph-container,
  .population-chart-container {
    padding: 10px;
    border: 1px solid #ccc;
    text-align: center;
  }
</style>
