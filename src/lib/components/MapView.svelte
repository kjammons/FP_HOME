<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { selectedCity, cityList, geoDataStore } from '../../stores/state.js';
  import { createOwnerRateScale } from '../utils/MapScales.js';
  import { loadGeoJSON } from '../utils/mapUtils.js';
  import '../utils/tooltip.css';

  let svgContainer;
  let tooltipElement;
  const width = 800, height = 600;
  let geoData;
  let selectedFeature = null;

  let selectedRateType = 'j_OWNER_RATE';  // default data to map
let colorScale;
let projection; 

  onMount(async () => {
    try {
    const response = await fetch('/data/ACSDATA2023SORTED_GeoJSON.geojson');
    if (!response.ok) throw new Error('HTTP error: ' + response.status);
    geoData = await response.json();
    console.log("Loaded geoData:", geoData);
  } catch (error) {
    console.error('Error loading GeoJSON:', error);
  }
  
  try {
      // Load GeoJSON from the public folder
      geoData = await loadGeoJSON('src/lib/assets/data/SB_ACSDATA_2.geojson');
      console.log('Loaded geoData:', geoData);

      // Store geoData in shared store and update city list
      geoDataStore.set(geoData);
      let cities = geoData.features.map(f => f.properties.TOWN20);
      cities = [...new Set(cities)];
      cityList.set(cities);

      // Create a color scale for the map based on j_OWNER_RATE
      const colorScale = createOwnerRateScale(geoData.features, selectedRateType);
      renderMap(colorScale);
    } catch (error) {
      console.error('Error loading GeoJSON:', error);
    }
  });

  function renderMap(colorScale) {
    const svg = d3.select(svgContainer)
      .attr('width', width)
      .attr('height', height);

    // Clear existing content
    svg.selectAll('*').remove();

    // Create a projection and path generator
    //const projection = d3.geoMercator().fitSize([width, height], geoData);
    // Calculate bounds manually
const bounds = d3.geoBounds(geoData);
const center = [
  (bounds[0][0] + bounds[1][0]) / 2,
  (bounds[0][1] + bounds[1][1]) / 2
];

const projection = d3.geoMercator()
  .center(center)
  .fitSize([width, height], geoData);

    const path = d3.geoPath().projection(projection);

    // Draw each municipality
    svg.selectAll('path')
      .data(geoData.features)
      .join('path')
      .attr('d', path)
      .attr('stroke', d => (selectedFeature && d.properties.TOWN20 === selectedFeature.properties.TOWN20) ? 'white' : '#fafafa')
.attr('stroke-width', d => (selectedFeature && d.properties.TOWN20 === selectedFeature.properties.TOWN20) ? 1 : 0.5)

      .attr('fill', d => {
        const popVal = +d.properties[selectedRateType];
        return isNaN(popVal) ? '#ccc' : colorScale(popVal);
      })
      .attr('opacity', d => (selectedFeature && d.properties.TOWN20 === selectedFeature.properties.TOWN20) ? 1 : 0.3)

      .on('mouseover', (event, d) => {
        const city = d.properties.TOWN20 || "Unknown City";
        const pop = +((d.properties.j_OWNER_RATE * 100).toFixed(2)) || "N/A";
        d3.select(tooltipElement)
          .style('opacity', 1)
          .html(`<strong>${city} </strong> <br/><br/>Homeownership Rate: ${pop}%`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY + 10) + 'px');

        // Fade out all other municipalities
        d3.select(svgContainer).selectAll('path')
          .transition()
          .duration(200)
          .style('opacity', function() {
            return (this === event.currentTarget) ? 1 : 0.3;
          });
      })
      .on('mousemove', (event) => {
        d3.select(tooltipElement)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY + 10) + 'px');
      })
      .on('mouseout', () => {
        d3.select(tooltipElement)
          .style('opacity', 0);
        // Reset opacity of all municipalities
        d3.select(svgContainer).selectAll('path')
          .transition()
          .duration(200)
          .style('opacity', 1);
      })
      .on('click', (event, d) => {
        event.stopPropagation();  // ✨ NEW: block event from reaching SVG
        // Set the selected city when a municipality is clicked.
        selectedCity.set(d.properties.TOWN20);
        selectedFeature = d;    // Save the clicked city
  renderMap(colorScale);  // Redraw the map to highlight it
      });

      svg.on('click', (event) => {
  selectedFeature = null;
  renderMap(colorScale);
});

      svg.append('image')
    .attr('x', width - 800)  // X position (distance from the right side of the SVG)
    .attr('y', height - 400) // Y position (distance from the bottom of the SVG)
    .attr('width', 250)      // Image width
    .attr('height', 300)     // Image height
    // .attr('href', 'src/lib/assets/images/image_2.jpeg') // Path to the image
    .attr('opacity', 0.8);   // Optional opacity effect for the image
    // Draw map legend in lower left corner
    drawMapLegend(colorScale, svg, 20, height - 60, 200, 10);
  }

  // Helper function to draw a legend for the map color scale.
  function drawMapLegend(scale, svg, x, y, legendWidth, legendHeight) {
    const legendGroup = svg.append('g')
      .attr('transform', `translate(${x}, ${y})`);

    // Generate tick values for the legend.
    const ticks = scale.ticks ? scale.ticks(5) : d3.ticks(scale.domain()[0], scale.domain()[1], 5);
    const rectWidth = legendWidth / ticks.length;

    ticks.forEach((d, i) => {
      legendGroup.append('rect')
        .attr('x', i * rectWidth)
        .attr('y', 0)
        .attr('width', rectWidth)
        .attr('height', legendHeight)
        .attr('fill', scale(d));
      legendGroup.append('text')
        .attr('x', i * rectWidth + rectWidth / 2)
        .attr('y', legendHeight + 15)
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .text((d * 100).toFixed(0) + '%');
    });
  }

  $: if ($selectedCity && geoData) {
  const match = geoData.features.find(f =>
    f.properties.TOWN20.trim() === $selectedCity.trim()
  );
  if (match) {
    selectedFeature = match;
    const colorScale = createOwnerRateScale(geoData.features); // recreate scale if needed
    renderMap(colorScale);
  }
}

$: if (geoData && colorScale && svgContainer) {
  colorScale = createOwnerRateScale(geoData.features, selectedRateType);
  renderMap(colorScale);
}

</script>

<h1>Home Ownership and Demographics in Middlesex County?</h1>

<div class="rate-toggle">
  <label for="rate-select">Select:</label>
  <select id="rate-select" bind:value={selectedRateType}>
    <option value="j_OWNER_RATE">Overall Homeownership Rate</option>
    <option value="j_NON-WHITE HOMEOWNERSHIP RATE">Non-White Homeownership Rate</option>
    <option value="j_WHITE HOMEOWNERSHIP RATE">White Homeownership Rate</option>
  </select>
</div>

<p>Source: Social Explorer ACS data 2018-2023 (census tract level)</p>

<svg bind:this={svgContainer}></svg>
<div bind:this={tooltipElement} class="tooltip"></div>

<style>
  svg {
    border: 1px solid white;
    display: block;
    margin: auto;
  }
  /* Tooltip styles are in tooltip.css */

  h1{
    font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
    text-align: center;
  }

  p{
    font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
    font-size: 80%;
    font-weight: lighter;
    font-style: italic;
    text-align: left;

  }
  .rate-toggle {
  text-align: center;
  margin-bottom: 15px;
  font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
}
#rate-select {
  margin-left: 10px;
  padding: 5px;
  font-size: 1rem;
}

</style>
