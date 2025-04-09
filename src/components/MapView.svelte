<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { createOwnerRateScale } from '../utils/MapScales.js';
  import { loadGeoJSON } from '../utils/mapUtils.js';
  import { cityList, geoDataStore } from '../stores/state.js';
  import '../utils/tooltip.css';

  let svgContainer;
  let tooltipElement;
  const width = 800, height = 600;
  let geoData;

  onMount(async () => {
    try {
      // Load GeoJSON from the public folder
      geoData = await loadGeoJSON('./data/ACSDATA2023SORTED_GeoJSON.geojson');
      console.log('Loaded geoData:', geoData);
      
      // Store geoData in shared store and update city list
      geoDataStore.set(geoData);
      let cities = geoData.features.map(f => f.properties.j_CITY_NAME);
      cities = [...new Set(cities)];
      cityList.set(cities);
      
      // Create a color scale for the map based on j_OWNER_RATE
      const colorScale = createOwnerRateScale(geoData.features);
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
        const pop = +((d.properties.j_OWNER_RATE * 100).toFixed(2)) || "N/A";
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
    
    // Draw map legend in lower left corner
    drawMapLegend(colorScale, svg, 20, height - 60, 200, 10);
  }

  // Helper function to draw a legend for the map color scale.
  function drawMapLegend(scale, svg, x, y, legendWidth, legendHeight) {
    const legendGroup = svg.append('g')
      .attr('transform', `translate(${x}, ${y})`);

    // Generate tick values for the legend
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
        .text((d*100).toFixed(0)+'%');
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
  /* Tooltip styles are in tooltip.css */
</style>
