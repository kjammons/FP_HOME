<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import { selectedVariable, selectedRegion } from '../stores/state.js';
    import { colorScale, getProjection } from '../utils/scales.js';
    import { zoomSetup } from './ZoomControls.js';
  
    export let geoData;
    export let demographicData;
  
    let svgContainer;
  
    $: currentVariable = $selectedVariable;
    $: currentRegion = $selectedRegion;
  
    $: if (geoData && demographicData && svgContainer) {
      renderMap();
    }
  
    function renderMap() {
      const width = 800, height = 600;
  
      d3.select(svgContainer).selectAll("*").remove(); // Clear previous renders
  
      const svg = d3.select(svgContainer)
        .attr('width', width)
        .attr('height', height);
  
      const projection = getProjection(currentRegion, width, height);
      const pathGenerator = d3.geoPath().projection(projection);
  
      // Merge data
      geoData.features.forEach(feature => {
        const match = demographicData.find(d => d.id === feature.properties.id);
        feature.properties = { ...feature.properties, ...match };
      });
  
      svg.selectAll("path")
        .data(geoData.features)
        .enter().append("path")
        .attr("d", pathGenerator)
        .attr("fill", d => colorScale(d.properties[currentVariable]))
        .on("mouseover", (event, d) => d3.select(event.target).attr('stroke', '#000'))
        .on("mouseout", (event) => d3.select(event.target).attr('stroke', 'none'));
  
      zoomSetup(svg);
    }
  </script>
  
  <svg bind:this={svgContainer}></svg>
  