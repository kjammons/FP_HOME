<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { getPopScale } from '../utils/scales.js';
  import { loadGeoJSON } from '../utils/mapUtils.js';
  import { cityList, geoDataStore } from '../stores/state.js';

  let svgContainer;
  let tooltipElement;
  const width = 800, height = 600;
  let geoData;

  onMount(async () => {
    try {
      // Load GeoJSON from the public folder
      geoData = await loadGeoJSON('/data/ACSDATA2023SORTED_GeoJSON.geojson');
      console.log('Loaded geoData:', geoData);
      
      // Store the full geoData in a shared store
      geoDataStore.set(geoData);
      
      // Extract the dynamic city list using the identifier "mapc_municipal"
      let cities = geoData.features.map(f => f.properties.j_CITY_NAME);
      // Remove duplicates
      cities = [...new Set(cities)];
      cityList.set(cities);
      
      // Create a color scale for pop2020
      const homerateValues = geoData.features.map(f => +f.properties.j_OWNER_RATE).filter(v => !isNaN(v));
      const minrate = d3.min(homerateValues);
      const maxrate = d3.max(homerateValues);
      const colorScale = getPopScale(minrate, maxrate);

      renderMap(colorScale);
    } catch (error) {
      console.error('Error loading GeoJSON:', error);
    }
  });

  function renderMap(colorScale) {
    const svg = d3.select(svgContainer)
      .attr('width', width)
      .attr('height', height);
    
    // Clear any previous drawings
    svg.selectAll('*').remove();
    
    // Create a projection to fit the GeoJSON data
    const projection = d3.geoMercator().fitSize([width, height], geoData);
    const path = d3.geoPath().projection(projection);

    // Draw each municipality
    svg.selectAll('path')
      .data(geoData.features)
      .join('path')
      .attr('d', path)
      .attr('stroke', '#333')
      .attr('fill', d => {
        const popVal = +d.properties.j_OWNER_RATE;
        return isNaN(popVal) ? '#ccc' : colorScale(popVal);
      })
      .on('mouseover', (event, d) => {
        const city = d.properties.j_CITY_NAME || "Unknown City";
        const pop = +( (d.properties.j_OWNER_RATE * 100).toFixed(2) ) || "N/A";
        d3.select(tooltipElement)
          .style('opacity', 1)
          .html(`<strong>${city}</strong><br/>Rate of Homeownership: ${pop}%`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY + 10) + 'px');
      })
      .on('mousemove', (event) => {
        d3.select(tooltipElement)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY + 10) + 'px');
      })
      .on('mouseout', () => {
        d3.select(tooltipElement)
          .style('opacity', 0);
      });
  }
</script>

<svg bind:this={svgContainer}></svg>
<div bind:this={tooltipElement} class="tooltip"></div>

<style>
  svg {
    border: 1px solid #ccc;
    display: block;
    margin: auto;
  }
  .tooltip {
    position: absolute;
    pointer-events: none;
    background: rgba(255,255,255,0.9);
    border: 1px solid #333;
    padding: 5px;
    font-size: 0.9rem;
    border-radius: 3px;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
</style>
