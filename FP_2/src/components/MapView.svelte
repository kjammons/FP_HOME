<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  let geoData = null;
  let svgContainer;

  // Load GeoJSON data when component mounts
  onMount(async () => {
    try {
      geoData = await d3.json('/data/middlesex_geojson.geojson');
      renderMap();
    } catch (error) {
      console.error('Error loading GeoJSON:', error);
    }
  });

  function renderMap() {
    if (!geoData) return;
    const width = 800;
    const height = 600;

    // Clear any previous SVG content
    const svg = d3.select(svgContainer)
      .attr('width', width)
      .attr('height', height);

    // Create a projection and fit it to your geoData
    const projection = d3.geoMercator()
      .fitSize([width, height], geoData);

    const pathGenerator = d3.geoPath().projection(projection);

    // Draw each feature from the GeoJSON file
    svg.selectAll('path')
      .data(geoData.features)
      .enter()
      .append('path')
      .attr('d', pathGenerator)
      .attr('stroke', '#333')
      .attr('fill', '#ccc');
  }
</script>

<svg bind:this={svgContainer}></svg>

<style>
  svg {
    border: 1px solid #ccc;
  }
</style>
