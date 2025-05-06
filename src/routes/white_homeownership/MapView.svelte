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

  let selectedRace = 'White';
  let showShare = false;

  // which field we color by
  let selectedRateType;

  // color scale instance
  let colorScale;

  const raceFields = {
    'White': {
      rate: 'j_WHITE HOMEOWNERSHIP RATE (AS OF TOTAL)',
      share: 'j_SHARE_OWNER_WHITE'
    },
    'Black': {
      rate: 'j_BLACK HOME OWNERSHIP RATE',
      share: 'j_SHARE_OWNER_BLACK'
    },
    'Asian': {
      rate: 'j_ASIAN HOMEOWNERSHIP_RATE',
      share: 'j_SHARE_OWNER_ASIAN'
    },
    'American Indian': {
      rate: 'j_AMERICAN INDIAN HOMEOWNERSHIP_RATE',
      share: 'j_SHARE_OWNER_AMERICAN_INDIAN'
    },
    'Native Hawaiian': {
      rate: 'j_NATIVE HAWAIIAN HOMEOWNERSHIP_RATE',
      share: 'j_SHARE_OWNER_NATIVE_HAWAIIAN'
    },
    'Other': {
      rate: 'j_OTHER RACE HOMEOWNERSHIP RATE',
      share: 'j_SHARE_OWNER_OTHER'
    }
  };

  // const rateTypeLabels = {
  //   'j_OWNER_RATE': 'Overall Homeownership Rate',
  //   'j_WHITE HOMEOWNERSHIP RATE (AS OF TOTAL)': 'White Homeownership Rate',
  //   'j_BLACK HOME OWNERSHIP RATE': 'Black Homeownership Rate',
  //   'j_ASIAN HOMEOWNERSHIP_RATE': 'Asian Homeownership Rate',
  //   'j_AMERICAN INDIAN HOMEOWNERSHIP_RATE': 'American Indian Homeownership Rate',
  //   'j_NATIVE HAWAIIAN HOMEOWNERSHIP_RATE': 'Native Hawaiian Homeownership Rate',
  //   'j_OTHER RACE HOMEOWNERSHIP RATE': 'Other Race Homeownership Rate',

  //   'j_SHARE_OWNER_WHITE': 'Share of White Homeowners among All',
  // 'j_SHARE_OWNER_BLACK': 'Share of Black Homeowners among All',
  // 'j_SHARE_OWNER_ASIAN': 'Share of Asian Homeowners among All',
  // 'j_SHARE_OWNER_AMERICAN_INDIAN': 'Share of American Indian Homeowners among All',
  // 'j_SHARE_OWNER_NATIVE_HAWAIIAN': 'Share of Native Hawaiian Homeowners among All',
  // 'j_SHARE_OWNER_OTHER': 'Share of Other Race Homeowners among All'

  // };

  $: selectedRateType = showShare ? raceFields[selectedRace].share : raceFields[selectedRace].rate;
  $: tooltipLabel = showShare ? `Share of ${selectedRace} Homeowners` : `${selectedRace} Homeownership Rate`;

  onMount(async () => {
    // 1️⃣ Fetch the GeoJSON from your static folder
    try {
      const res = await fetch(`${base}/data/SB_ACSDATA_2.geojson`);
      geoData = await res.json();
      
      geoData.features.forEach(f => {
  const props = f.properties;
  const totalOwners = +props['j_OWNER HOUSING UNITS']; // total owner-occupied housing units

  // Add a derived value only if data is valid
  props['j_SHARE_OWNER_WHITE'] =
    totalOwners ? +props['j_TOTAL OWNERS_WHITE'] / totalOwners : NaN;
  props['j_SHARE_OWNER_BLACK'] =
    totalOwners ? +props['j_TOTAL OWNERS_BLACK'] / totalOwners : NaN;
  props['j_SHARE_OWNER_ASIAN'] =
    totalOwners ? +props['j_TOTAL OWNERS_ASIAN'] / totalOwners : NaN;
  props['j_SHARE_OWNER_AMERICAN_INDIAN'] =
    totalOwners ? +props['j_TOTAL OWNERS_AMERICAN INDIAN'] / totalOwners : NaN;
  props['j_SHARE_OWNER_NATIVE_HAWAIIAN'] =
    totalOwners ? +props['j_TOTAL OWNERS_NATIVE HAWAIIAN'] / totalOwners : NaN;
  props['j_SHARE_OWNER_OTHER'] =
    totalOwners ? +props['j_TOTAL OWNERS_some other race'] / totalOwners : NaN;
});


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
          console.log(selectedRateType, v); 
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
  `<strong>${city}</strong><br/>${tooltipLabel}: ${isNaN(pct) ? 'N/A' : pct + '%'}`
)
          .style('left', evt.pageX + 10 + 'px')
          .style('top', evt.pageY + 10 + 'px');
        // fade others
        svg
          .selectAll('path')
          .transition()
          .duration(200)
          .style('opacity', p =>
            p === d ? 1 : 0.6
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
    drawLegend(colorScale, svg, 20, 650, 200, 10);
  }

  function drawLegend(scale, svg, x = 20, y = height - 50, width = 200, height = 10) {
  const legendGroup = svg.append('g')
    .attr('transform', `translate(${x}, ${y})`);

  const legendValues = scale.ticks ? scale.ticks(5) : d3.ticks(scale.domain()[0], scale.domain()[1], 5);
  const rectWidth = width / (legendValues.length - 1);

  // Gradient legend
  legendGroup.selectAll('rect')
    .data(legendValues.slice(0, -1))
    .join('rect')
    .attr('x', (d, i) => i * rectWidth)
    .attr('y', 0)
    .attr('width', rectWidth)
    .attr('height', height)
    .attr('fill', d => scale(d));

  // Tick labels
  legendGroup.selectAll('text')
    .data(legendValues)
    .join('text')
    .attr('x', (d, i) => i * rectWidth)
    .attr('y', height + 12)
    .attr('font-size', '10px')
    .text(d => (d * 100).toFixed(0) + '%');
}

</script>

<h1>Exploring Homeownership in Middlesex County</h1>

<div class="rate-toggle">
  <label for="race-select">Select  group by race:</label>
  <select id="race-select" bind:value={selectedRace}>
    {#each Object.keys(raceFields) as race}
      <option value={race}>{race}</option>
    {/each}
  </select>

  <label class="switch">
    <input type="checkbox" bind:checked={showShare} />
    <span class="slider"></span>
  </label>
  <span class="toggle-label">{showShare ? 'Racial share of all homeowners ' : 'Homeownership within each racial group'}</span>
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
    overflow: visible;
  }

  .rate-toggle {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 24px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: #ccc;
    border-radius: 24px;
    transition: .4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    border-radius: 50%;
    transition: .4s;
  }

  input:checked + .slider {
    background-color: #2196F3;
  }
  input:checked + .slider:before {
    transform: translateX(26px);
  }

  .toggle-label {
    font-size: 0.9rem;
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
