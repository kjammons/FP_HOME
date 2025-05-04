<!-- src/lib/components/MapView.svelte -->
<script>
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import * as d3 from 'd3';
  import { selectedCity, cityList, geoDataStore } from '../../stores/state.js';
  import { createOwnerRateScale } from '$lib/utils/MapScales.js';
  import '$lib/utils/tooltip.css';

  let svgEl;
  let tooltipEl;
  let geoData;
  let selectedFeature = null;

  const width = 800;
  const height = 600;

  // which field we color by
  let selectedRateType = 'j_OWNER_RATE';

  // color scale instance
  let colorScale;

  const rateTypeLabels = {
    j_OWNER_RATE: 'Overall Homeownership Rate',
    'j_WHITE HOMEOWNERSHIP RATE (AS OF TOTAL)': 'White Homeownership Rate',
    'j_BLACK HOME OWNERSHIP RATE': 'Black Homeownership Rate',
    'j_ASIAN_HOMEOWNERSHIP_RATE': 'Asian Homeownership Rate',
    'j_AMERICAN_INDIAN_HOMEOWNERSHIP_RATE': 'American Indian Homeownership Rate',
    'j_NATIVE_HAWAIIAN_HOMEOWNERSHIP_RATE': 'Native Hawaiian Homeownership Rate',
    'j_OTHER RACE HOMEOWNERSHIP RATE': 'Other Race Homeownership Rate'
  };

  onMount(async () => {
    // 1️⃣ Fetch the GeoJSON from your static folder
    try {
      const res = await fetch(`${base}/data/SB_ACSDATA_2.geojson`);
      geoData = await res.json();
    } catch (err) {
      return console.error('Error loading GeoJSON:', err);
    }

    // 2️⃣ Seed your stores
    geoDataStore.set(geoData);
    const cities = Array.from(new Set(geoData.features.map(f => f.properties.TOWN20)));
    cityList.set(cities);

    // 3️⃣ Build the initial color scale & render
    colorScale = createOwnerRateScale(geoData.features, selectedRateType);
    renderMap();
  });

  // re-render on rate type change
  $: if (geoData && selectedRateType) {
    colorScale = createOwnerRateScale(geoData.features, selectedRateType);
    renderMap();
  }

  // re-render on city selection change
  $: if ($selectedCity && geoData) {
    selectedFeature = geoData.features.find(
      f => f.properties.TOWN20.trim() === $selectedCity.trim()
    );
    renderMap();
  }

  function renderMap() {
    if (!geoData || !svgEl) return;

    const projection = d3
      .geoMercator()
      .fitSize([width, height], geoData);

    const pathGen = d3.geoPath().projection(projection);

    const svg = d3
      .select(svgEl)
      .attr('width', width)
      .attr('height', height)
      .html(''); // clear

    // draw each tract
    svg
      .selectAll('path')
      .data(geoData.features)
      .join('path')
        .attr('d', pathGen)
        .attr('fill', d => {
          const v = +d.properties[selectedRateType];
          return isNaN(v) ? '#ccc' : colorScale(v);
        })
        .attr('stroke', '#fafafa')
        .attr(
          'stroke-width',
          d =>
            selectedFeature &&
            d.properties.TOWN20 === selectedFeature.properties.TOWN20
              ? 2
              : 0.5
        )
        .attr(
          'opacity',
          d =>
            selectedFeature &&
            d.properties.TOWN20 === selectedFeature.properties.TOWN20
              ? 1
              : 0.6
        )
      .on('mouseover', (evt, d) => {
        const city = d.properties.TOWN20;
        const pct = +(d.properties[selectedRateType] * 100).toFixed(1);
        d3.select(tooltipEl)
          .style('opacity', 1)
          .html(
            `<strong>${city}</strong><br/>${
              rateTypeLabels[selectedRateType]
            }: ${isNaN(pct) ? 'N/A' : pct + '%'}`
          )
          .style('left', evt.pageX + 10 + 'px')
          .style('top', evt.pageY + 10 + 'px');
        // fade others
        svg
          .selectAll('path')
          .transition()
          .duration(200)
          .style('opacity', p =>
            p === d ? 1 : 0.2
          );
      })
      .on('mousemove', evt => {
        d3.select(tooltipEl)
          .style('left', evt.pageX + 10 + 'px')
          .style('top', evt.pageY + 10 + 'px');
      })
      .on('mouseout', () => {
        d3.select(tooltipEl).style('opacity', 0);
        svg
          .selectAll('path')
          .transition()
          .duration(200)
          .style('opacity', 1);
      })
      .on('click', (evt, d) => {
        evt.stopPropagation();
        selectedCity.set(d.properties.TOWN20);
      });

    // clear selection on background click
    svg.on('click', () => {
      selectedFeature = null;
      selectedCity.set('');
      renderMap();
    });
  }
</script>

<h1>Exploring Homeownership in Middlesex County</h1>

<div class="rate-toggle">
  <label for="rate-select">Select rate:</label>
  <select id="rate-select" bind:value={selectedRateType}>
    {#each Object.entries(rateTypeLabels) as [key, label]}
      <option value={key}>{label}</option>
    {/each}
  </select>
</div>

<svg bind:this={svgEl}></svg>
<div bind:this={tooltipEl} class="tooltip"></div>

<p class="source">
  Source: ACS data (2018–2023), census-tract level
</p>

<style>
  svg {
    display: block;
    margin: auto;
    width: 800px;
    height: 600px;
  }

  .rate-toggle {
    text-align: center;
    margin-bottom: 1rem;
  }

  .tooltip {
    position: absolute;
    pointer-events: none;
    background: rgba(0,0,0,0.8);
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 0.9rem;
    opacity: 0;
    transition: opacity 0.1s;
  }

  .source {
    font-size: 0.8rem;
    font-style: italic;
    text-align: center;
    margin-top: 0.5rem;
  }
</style>
