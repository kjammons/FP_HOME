<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { selectedCity, geoDataStore, cityList } from '../../stores/state.js';
  import { createBarChartScale } from '../../lib/utils/chartScales.js';
  import { chartDimensions, barStyle, centerLineStyle, textStyle } from '../../lib/utils/chartStyles.js';
  import { loadGeoJSON } from '../../lib/utils/mapUtils.js';
  import { base } from '$app/paths';
  import '$lib/utils/tooltip.css';


  const { width, height, margin } = chartDimensions;
  const { barHeight, barPadding } = barStyle;

  const chartSettings = {
  width: () => Math.min(800, window.innerWidth * 0.9),
  height: 450,
  margin: { top: 20, right: 20, bottom: 20, left: 20 },
  barHeight: 25,
  barPadding: 5
};

  // Remove map view container variable.
  // We'll only use two containers for the charts.
  let svgHomeownership;
  let svgPopulation;
  let svgIncome;
  let geoData;
  let responsiveWidth = () => Math.min(800, window.innerWidth * 0.9);

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

      $: medianRenterIncome = currentFeature?.properties["j_MEDIAN_RENTER HOUSEHOLD INCOME"] || null;
  $: medianOwnerIncome = currentFeature?.properties["j_MEDIAN_OWNER HOUSEHOLD INCOME"] || null;
  $: medianOverallIncome = currentFeature?.properties["j_MEDIAN_HOUSEHOLD INCOME"] || null;


  // When a city is selected and the SVGs are present, draw the two charts.
  $: if (currentFeature && svgHomeownership && barChartColorScale) {
    drawHomeownershipChart(currentFeature);
  }
  $: if (currentFeature && svgPopulation) {
    drawPopulationChart(currentFeature);
  }
  $: if (currentFeature && svgIncome) {
    drawIncomeChart(currentFeature);
  }
  onMount(() => {
    window.addEventListener('resize', () => {
      if (currentFeature) {
        drawHomeownershipChart(currentFeature);
        drawPopulationChart(currentFeature);
        drawIncomeChart(currentFeature);
      }
    });
  });
  // --- Homeownership Pyramid Chart ---
function drawHomeownershipChart(feature) {
const whiteKey = "j_SHARE_OWNER_WHITE";
const blackKey = "j_SHARE_OWNER_BLACK";
const asianKey = "j_SHARE_OWNER_ASIAN";
const indianKey = "j_SHARE_OWNER_AMERICAN_INDIAN";
const hawaiianKey = "j_SHARE_OWNER_NATIVE_HAWAIIAN";
const otherKey = "j_SHARE_OWNER_OTHER";

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
const svgWidth = responsiveWidth();
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
    "Other": "#7F3C8D"
  };

  const xScale = d3.scaleLinear()
    .domain([0, 1])
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
  "Other": "#7F3C8D"          
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
      .domain([0, 1])
      .range([0, halfWidth]);

    // Clear previous drawing
    d3.select(svgPopulation).selectAll('*').remove();
    const g = d3.select(svgPopulation)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

  
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

  function drawIncomeChart(feature) {
  const ownerIncome = +feature.properties['j_MEDIAN_OWNER HOUSEHOLD INCOME'] || 0;
  const renterIncome = +feature.properties['j_MEDIAN_RENTER HOUSEHOLD INCOME'] || 0;
  const overallIncome = +feature.properties['j_MEDIAN_HOUSEHOLD INCOME'] || 0;

  const data = [
    { type: 'Owner Households', value: ownerIncome },
    { type: 'Renter Households', value: renterIncome },
    { type: 'Overall Households', value: overallIncome }
  ];

  // Clear any previous SVG content
  d3.select(svgIncome).html('');

  const container = d3.select(svgIncome)
    .attr("width", "100%")
    .attr("height", null)
    .append("foreignObject")
    .attr("width", "100%")
    .attr("height", 150)
    .append("xhtml:div")
    .attr("class", "income-box-wrapper");

  data.forEach(d => {
    container.append("div")
    .attr("class", "income-box")
    .style("display", "flex")
    .style("flex-direction", "row")
    .style("align-items", "center")
    .style("margin-bottom", "10px")
    .html(`
      <div style="font-weight: bold; font-size: 1rem; margin-right: 20px; ">${d.type}</div>
      <div style="
        background: gray;
        padding: 8px 14px;
        border: 2px solid #A91B0D;
        border-radius: 8px;
        font-size: 0.95rem;
        color: #003344;
      ">$${d3.format(",.0f")(d.value)}</div>
    `);
});
}
  
</script>

<!-- City Selector -->
<div class="selection">
  <label for="city-select">Select a City:</label>
  <select id="city-select" bind:value={$selectedCity}>
    <option value="">-- Choose a city --</option>
    {#each $cityList.sort() as city}
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
      <div class="bargraph-container">
        <h2>Homeownership Share for {currentFeature.properties.TOWN20} </h2>
        <svg bind:this={svgHomeownership}></svg>
      </div>
      <div class="income-chart-container">
        <h2>Median Household Incomes for {currentFeature.properties.TOWN20} </h2>
        <svg bind:this={svgIncome}></svg>
      </div>
    </div>
  {:else}
    <p>Please select a city to see its data.</p>
  {/if}
</div>

<style>
  .selection {
    margin-bottom: 20px;
    text-align: center;
    font-family: 'Helvetica';
  }
  label {
    font-size: 1rem;
    margin-right: 10px;
    font-size: 100%;
    font-family: 'Helvetica';
  }

  h2{
    font-size: 1rem;
    margin-right: 10px;
    font-size: 120%;
    font-family: 'Helvetica';
  }

  p{
    font-size: 1rem;
    margin-right: 10px;
    font-size: 150%;
    font-family: 'Helvetica';
  }
  select {
    font-size: 1rem;
    font-family: 'Helvetica';
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
  .population-chart-container,
  .income-chart-container {
    padding: 10px;
    border: 1px #ccc;
    text-align: center;
    font-family: 'Helvetica';
    color: #fff;
  }

  .income-chart-container {
    margin-top: -130px;
    padding: 10px;
  }

  .no-data-text {
    font-family: 'Helvetica';
    text-anchor: middle;
  }

  h2, p, label, select, option {
  color: #fff;
  background-color: #000;
}

</style>
