<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { selectedCity, geoDataStore, cityList } from '../../stores/state.js';
  import { createBarChartScale } from '../utils/chartScales.js';
  import { chartDimensions, barStyle, centerLineStyle, textStyle } from '../utils/chartStyles.js';
  import { loadGeoJSON } from '../utils/mapUtils.js';
  import '../utils/tooltip.css';

  const { width, height, margin } = chartDimensions;

  const chartSettings = {
  width: () => Math.min(800, window.innerWidth * 0.9),
  height: 300,
  margin: { top: 20, right: 20, bottom: 20, left: 20 },
  barHeight: 25,
  barPadding: 5
};

  // Remove map view container variable.
  // We'll only use two containers for the charts.
  let svgHomeownership;
  let svgPopulation;
  let geoData;

  // On mount, load GeoJSON data, update the shared store, and populate the dropdown.
  onMount(async () => {
    try {
      const data = await d3.json('src/lib/assets/data/SB_ACSDATA_2.geojson');
      geoDataStore.set(data);
      geoData = data;

      // Extract unique city names, sorted alphabetically.
      const cities = data.features.map(f => f.properties.TOWN20);
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
            f.properties.TOWN20.trim() === $selectedCity.trim())
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
  const whiteKey = "j_WHITE HOMEOWNERSHIP RATE (AS OF TOTAL)";
  const blackKey = "j_BLACK HOME OWNERSHIP RATE";
  const asianKey = "j_ASIAN HOMEOWNERSHIP_RATE";
  const indianKey = "j_AMERICAN INDIAN HOMEOWNERSHIP_RATE";
  const hawaiianKey = "j_NATIVE HAWAIIAN HOMEOWNERSHIP_RATE";
  const otherKey = "j_OTHER RACE HOMEOWNERSHIP RATE";

  const values = [
    { race: "White", rate: +feature.properties[whiteKey] || 0 },
    { race: "Black", rate: +feature.properties[blackKey] || 0 },
    { race: "Asian", rate: +feature.properties[asianKey] || 0 },
    { race: "American Indian", rate: +feature.properties[indianKey] || 0 },
    { race: "Native Hawaiian", rate: +feature.properties[hawaiianKey] || 0 },
    { race: "Other", rate: +feature.properties[otherKey] || 0 }
  ];

  const filteredValues = values.filter(d => d.rate > 0);

  const { width, height, margin, barHeight, barPadding } = chartSettings;
const svgWidth = width();
const svgHeight = height;
const innerWidth = svgWidth - margin.left - margin.right;
const innerHeight = svgHeight - margin.top - margin.bottom;
  const halfWidth = innerWidth / 2;


  const maxVal = d3.max(filteredValues, d => d.rate);

  // Clear previous drawing
  d3.select(svgHomeownership).selectAll('*').remove();

  const svg = d3.select(svgHomeownership)
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  // ✨ If no data available
  if (filteredValues.length === 0) {
    svg.append('text')
      .attr('class', 'no-data-text')
      .attr('x', width / 2)
      .attr('y', height / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', '#666')
      .text('No data available');
    return;
  }

  const raceColors = {
    "White": "#F97B72",
    "Black": "#F2B701",
    "Asian": "#11A579",
    "American Indian": "#CA73C6",
    "Native Hawaiian": "#D05D02",
    "Other": "#3969AC"
  };

  const xScale = d3.scaleLinear()
    .domain([0, maxVal])
    .range([0, halfWidth]);

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  g.selectAll('rect')
    .data(filteredValues)
    .join('rect')
    .attr('x', 0)
    .attr('y', (d, i) => i * (barHeight + barPadding))
    .attr('width', d => xScale(d.rate))
    .attr('height', barHeight)
    .attr('fill', d => raceColors[d.race] || "#ccc");

  g.selectAll('text')
    .data(filteredValues)
    .join('text')
    .attr('x', d => xScale(d.rate) + 5)
    .attr('y', (d, i) => i * (barHeight + barPadding) + barHeight / 2)
    .attr('dy', '0.35em')
    .attr('fill', textStyle.fill)
    .style('font-size', textStyle.fontSize)
    .text(d => `${d.race}: ${(d.rate * 100).toFixed(2)}%`);
}

  // --- Population Pyramid Chart ---
  function drawPopulationChart(feature) {
    const whiteKey = "j_PROP_POP WHITE";
    const blackKey = "j_PROP_POP BLACK";
    const asianKey = "j_PROP_POP ASIAN";
    const indianKey = "j_PROP_POP AMERICAN INDIAN";
    const hawaiianKey = "j_PROP_POP NATIVE HAWAIIAN";
    const otherKey = "j_PROP_POP OTHER";

    const values = [
  { race: "White", pop: +feature.properties[whiteKey] || 0 },
  { race: "Black", pop: +feature.properties[blackKey] || 0 },
  { race: "Asian", pop: +feature.properties[asianKey] || 0 },
  { race: "American Indian", pop: +feature.properties[indianKey] || 0 },
  { race: "Native Hawaiian", pop: +feature.properties[hawaiianKey] || 0 },
  { race: "Other", pop: +feature.properties[otherKey] || 0 }

];
console.log('Population values:', values);

const raceColors = {
  "White": "#F97B72",         
  "Black": "#F2B701",        
  "Asian": "#11A579",         
  "American Indian": "#CA73C6", 
  "Native Hawaiian": "#D05D02", 
  "Other": "#3969AC"          
};

const filteredValues = values.filter(d => d.pop > 0); 
    const maxVal = d3.max(values, d => d.pop);
   
    const width = Math.min(800, window.innerWidth * 0.9);  // responsive width
  const height = 300;

  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const halfWidth = innerWidth / 2;
  
  const barHeight = 25;  // or use your barStyle values if you want
  const barPadding = 5; 

    const xScale = d3.scaleLinear()
      .domain([0, maxVal])
      .range([0, halfWidth]);

    // Clear previous drawing
    d3.select(svgPopulation).selectAll('*').remove();
    const g = d3.select(svgPopulation)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

  
      if (filteredValues.length === 0) {
  d3.select(svgPopulation).selectAll('*').remove(); // Clear old
  
  const svg = d3.select(svgPopulation)
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  svg.append('text')
    .attr('class', 'no-data-text')    // CSS class
    .attr('x', width / 2)             // center horizontally
    .attr('y', height / 2)            // center vertically
    .attr('text-anchor', 'middle')    // center text anchor
    .attr('fill', '#666')             // explicitly set fill
    .text('No data available');
  
  return; // 🚨 Stop further drawing
}

      g.selectAll('rect')
  .data(filteredValues)
  .join('rect')
  .attr('x', 0)
  .attr('y', (d, i) => i * (barHeight + barPadding))
  .attr('width', d => xScale(d.pop))
  .attr('height', barHeight)
  .attr('fill', d => raceColors[d.race] || "#ccc");  // Different color

g.selectAll('text')
  .data(filteredValues)
  .join('text')
  .attr('x', d => xScale(d.pop) + 5)
  .attr('y', (d, i) => i * (barHeight + barPadding) + barHeight / 2 + 5)
  .attr('fill', textStyle.fill)
  .style('font-size', textStyle.fontSize)
  .text(d => `${d.race}: ${(d.pop * 100).toFixed(2)}%`);
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
        <h2>Racial Demographics for {currentFeature.properties.TOWN20}</h2>
        <svg bind:this={svgPopulation} width={width} height={height}></svg>
      </div>
    </div>
      <div class="bargraph-container">
        <h2>Homeownership Rate by Race for {currentFeature.properties.TOWN20} </h2>
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
    font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
  }
  label {
    font-size: 1rem;
    margin-right: 10px;
    font-size: 100%;
    font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
  }

  h2{
    font-size: 1rem;
    margin-right: 10px;
    font-size: 120%;
    font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
  }

  p{
    font-size: 1rem;
    margin-right: 10px;
    font-size: 150%;
    font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
  }
  select {
    font-size: 1rem;
    font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
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
    border: 1px #ccc;
    text-align: center;
    font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
  }

  .no-data-text {
    font-size: 150%;
    font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
    fill: #666;
    text-anchor: middle;
  }

</style>
