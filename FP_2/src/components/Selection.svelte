<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { selectedCity, cityList, geoDataStore } from '../stores/state.js';
  import { derived } from 'svelte/store';

  // --- City Selection Setup ---
  let cities = [];
  cityList.subscribe(value => {
    cities = value;
  });

  // Holds the current selection from the dropdown.
  let currentCity = "";
  // Update the shared selectedCity store whenever currentCity changes.
  $: selectedCity.set(currentCity);

  // Derived store: When currentCity is set and geoDataStore is available,
  // extract the matching feature.
  const selectedFeature = derived(
    geoDataStore,
    ($geoDataStore, set) => {
      if ($geoDataStore && currentCity) {
        // Using trim() here ensures that any extra spaces are removed.
        const feature = $geoDataStore.features.find(
          f => f.properties.j_CITY_NAME.trim() === currentCity.trim()
        );
        set(feature);
      } else {
        set(null);
      }
    }
  );

  // --- D3 Bar Chart Setup ---
  // Dimensions for the bar chart SVG.
  const width = 400,
        height = 200;
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  let svgEl;

  // Reactive statement: When $selectedFeature (from our derived store) and svgEl are ready,
  // draw the chart.
  $: if ($selectedFeature && svgEl) {
    console.log("Drawing bar chart for:", $selectedFeature.properties.j_CITY_NAME);
    drawChart($selectedFeature);
  }

  function drawChart(feature) {
    // Define the keys corresponding to historical population properties.
    const keys = ['j_POP2000', 'j_POP2010', 'j_POP2020'];

    // Convert each property value to a number
    const values = keys.map(key => {
      const raw = feature.properties[key];
      const num = +raw;
      console.log(`For ${key}: raw="${raw}", numeric=${num}`);
      return isNaN(num) ? 0 : num;
    });

    // Select the SVG and remove any existing content.
    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create an x-scale using a band scale keyed by our header names.
    const xScale = d3.scaleBand()
      .domain(keys)
      .range([0, innerWidth])
      .padding(0.1);

    // Create a y-scale based on the maximum value found.
    const maxVal = d3.max(values);
    const yScale = d3.scaleLinear()
      .domain([0, maxVal])
      .range([innerHeight, 0]);

    // Append an inner group to handle margins.
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Draw the x-axis.
    g.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale));

    // Draw the y-axis.
    g.append("g")
      .call(d3.axisLeft(yScale));

    // Draw the bars for each population value.
    g.selectAll("rect")
      .data(keys)
      .join("rect")
      .attr("x", d => xScale(d))
      .attr("y", d => {
        const num = isNaN(+feature.properties[d]) ? 0 : +feature.properties[d];
        return yScale(num);
      })
      .attr("width", xScale.bandwidth())
      .attr("height", d => {
        const num = isNaN(+feature.properties[d]) ? 0 : +feature.properties[d];
        return innerHeight - yScale(num);
      })
      .attr("fill", "steelblue");
  }
</script>

<!-- --- Markup --- -->
<div class="selection">
  <label for="city-select">Select a City:</label>
  <select id="city-select" bind:value={currentCity}>
    <option value="">-- Choose a city --</option>
    {#each cities as city}
      <option value={city}>{city}</option>
    {/each}
  </select>
</div>

{#if currentCity}
  {#if $selectedFeature}
    <div class="bargraph-container">
      <h2>{$selectedFeature.properties.j_CITY_NAME} Population</h2>
      <svg bind:this={svgEl} width={width} height={height}></svg>
    </div>
  {:else}
    <p>No data available for {currentCity}.</p>
  {/if}
{:else}
  <p>Please select a city to see its historical population bar chart.</p>
{/if}

<!-- --- CSS Styles --- -->
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
  }
</style>
