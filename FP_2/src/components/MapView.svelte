<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { selectedVariable } from '../stores/state.js';
  import { getColorScale } from '../utils/scales.js';
  import { loadGeoJSON, loadDemographicsData } from '../utils/mapUtils.js';

  let svgContainer;
  let geoData = null;
  let demographics = null;
  const width = 800, height = 600;

  // Subscribe to the selected variable from the control panel.
  $: currentVariable = $selectedVariable;

  onMount(async () => {
    try {
      // Load GeoJSON and CSV (ACS data)
      geoData = await loadGeoJSON('/data/middlesex_geojson.geojson');
      demographics = await loadDemographicsData('/data/ACSDATA2023SORTED.csv');
      
      console.log('Loaded geoData:', geoData);
      console.log('Loaded demographics:', demographics);

      // Merge CSV data into each GeoJSON feature using string matching for safety.
      // (Assumes GeoJSON feature.properties.id matches CSV row.id, which we set from Geo_FIPS.)
      geoData.features.forEach(feature => {
        const match = demographics.find(row => String(row.id) === String(feature.properties.id));
        if (match) {
          feature.properties = { ...feature.properties, ...match };
        }
        console.log(`Feature ${feature.properties.id} after merge:`, feature.properties);
      });

      // Initial render.
      renderMap();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  });

  // Re-render the map whenever geoData is loaded and the current variable changes.
  $: if (geoData && currentVariable) {
    renderMap();
  }

  function renderMap() {
    const svg = d3.select(svgContainer)
      .attr('width', width)
      .attr('height', height);

    // Clear previous map content.
    svg.selectAll('*').remove();

    // Create a projection that fits the GeoJSON data.
    const projection = d3.geoMercator().fitSize([width, height], geoData);
    const path = d3.geoPath().projection(projection);

    // Draw features.
    svg.selectAll('path')
      .data(geoData.features)
      .join('path')
      .attr('d', path)
      .attr('stroke', '#333')
      .attr('fill', d => {
        const val = d.properties[currentVariable];
        console.log(`Feature ${d.properties.id}: ${currentVariable} =`, val);
        if (val == null || isNaN(+val)) return '#ccc';
        return getColorScale(currentVariable)(+val);
      });
  }
</script>

<svg bind:this={svgContainer}></svg>

<style>
  svg {
    border: 1px solid #ccc;
    display: block;
    margin: auto;
  }
</style>
