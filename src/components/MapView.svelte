
<h1>Home Ownership and Demographics in Middlesex County?</h1>

<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { selectedCity, cityList, geoDataStore } from '../stores/state.js';
  import { createOwnerRateScale } from '../utils/MapScales.js';
  import { loadGeoJSON } from '../utils/mapUtils.js';
  import '../utils/tooltip.css';

  let svgContainer;
  let tooltipElement;
  const width = 800, height = 600;
  let cityFeatures = [];

  onMount(async () => {
    try {
      const geoData = await loadGeoJSON('./data/ACSDATA2023SORTED_GeoJSON.geojson');
      console.log('Loaded geoData:', geoData);

      geoDataStore.set(geoData);
      let cities = [...new Set(geoData.features.map(f => f.properties.j_CITY_NAME))];
      cityList.set(cities);

      // Group by city and dissolve geometries
      cityFeatures = groupFeaturesByCity(geoData.features);

      const colorScale = createOwnerRateScale(cityFeatures);
      renderMap(colorScale);
    } catch (error) {
      console.error('Error loading GeoJSON:', error);
    }
  });

  function groupFeaturesByCity(features) {
  const grouped = d3.groups(features, d => d.properties.j_CITY_NAME);

  return grouped.map(([cityName, cityTracts]) => {
    const geometry = {
      type: 'MultiPolygon',
      coordinates: cityTracts.flatMap(f => {
        return f.geometry.type === 'Polygon'
          ? [f.geometry.coordinates]
          : f.geometry.coordinates;
      })
    };

    // Use the first tract’s pre-aggregated city-level HOMEOWNERSHIP_RATE
    const homeownershipRate = +cityTracts[0].properties.HOMEOWNERSHIP_RATE;

    return {
      type: 'Feature',
      geometry,
      properties: {
        j_CITY_NAME: cityName,
        HOMEOWNERSHIP_RATE: homeownershipRate
      }
    };
  });
}

function renderMap(colorScale) {
  const svg = d3.select(svgContainer)
    .attr('width', width)
    .attr('height', height);

  svg.selectAll('*').remove();

  const projection = d3.geoMercator().fitSize([width, height], { type: "FeatureCollection", features: cityFeatures });
  const path = d3.geoPath().projection(projection);

  svg.selectAll('path')
    .data(cityFeatures)
    .join('path')
    .attr('d', path)
    .attr('stroke', '#333') // Darker city boundaries
    .attr('fill', d => {
      const val = +d.properties.HOMEOWNERSHIP_RATE;
      return isNaN(val) ? '#ccc' : colorScale(val);
    })
    .on('mouseover', (event, d) => {
      const city = d.properties.j_CITY_NAME || "Unknown City";
      const rate = +((d.properties.HOMEOWNERSHIP_RATE * 100).toFixed(2)) || "N/A";
      d3.select(tooltipElement)
        .style('opacity', 1)
        .html(`<strong>${city}</strong><br/>Homeownership Rate: ${rate}%`)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY + 10) + 'px');

      d3.select(svgContainer).selectAll('path')
        .transition().duration(200)
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
      d3.select(tooltipElement).style('opacity', 0);
      d3.select(svgContainer).selectAll('path')
        .transition().duration(200)
        .style('opacity', 1);
    })
    .on('click', (event, d) => {
      selectedCity.set(d.properties.j_CITY_NAME);
    });

  svg.append('image')
    .attr('x', width - 800)
    .attr('y', height - 400)
    .attr('width', 250)
    .attr('height', 300)
    .attr('href', './images/image_2.jpeg')
    .attr('opacity', 0.8);

  drawMapLegend(colorScale, svg, 20, height - 60, 200, 10);
}


  function drawMapLegend(scale, svg, x, y, legendWidth, legendHeight) {
    const legendGroup = svg.append('g').attr('transform', `translate(${x}, ${y})`);
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
</script>

<svg bind:this={svgContainer}></svg>
<div bind:this={tooltipElement} class="tooltip"></div>
