<!-- src/lib/components/MapView.svelte -->
<script>
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import * as d3 from 'd3';
  import { selectedCity, cityList, geoDataStore } from '../../stores/state.js';
  import {
  createShareScale,
  createDifferenceScale,
} from '$lib/utils/MapScales.js';
  import '$lib/utils/tooltip.css';

  let svgEl;
  let tooltipEl;
  let geoData;
  let selectedFeature = null;
  let showInsights = false;


  
  const width = 800;
  const height = 600;

  let selectedRace = 'Black';
  let showShare = false;

  // which field we color by
  let selectedRateType;

  // color scale instance
  let colorScale;

  const raceFields = {
    'White': {
      diff: null,
      share: 'j_SHARE_OWNER_WHITE'
    },
    'Black': {
      diff: 'DIFF_BLACK_WHITE',
      share: 'j_SHARE_OWNER_BLACK'
    },
    'Asian': {
      diff: 'DIFF_ASIAN_WHITE',
      share: 'j_SHARE_OWNER_ASIAN'
    },
    'American Indian': {
      diff: 'DIFF_AMERICAN_INDIAN_WHITE',
      share: 'j_SHARE_OWNER_AMERICAN_INDIAN'
    },
    'Native Hawaiian': {
      diff: 'DIFF_NATIVE_HAWAIIAN_WHITE',
      share: 'j_SHARE_OWNER_NATIVE_HAWAIIAN'
    },
    'Other': {
      diff: 'DIFF_OTHER_WHITE',
      share: 'j_SHARE_OWNER_OTHER'
    }
  };

  $: selectedRateType = showShare ? raceFields[selectedRace].share : raceFields[selectedRace].diff;
  $: tooltipLabel = showShare ? `Share of ${selectedRace} Homeowners` : `Difference: ${selectedRace} vs. White Homeownership Rate`;

  onMount(async () => {
    // 1️⃣ Fetch the GeoJSON from your static folder
    try {
      const res = await fetch(`${base}/data/SB_ACSDATA_2.geojson`);
      geoData = await res.json();

      geoData.features.forEach(f => {
  const props = f.properties;
  const totalOwners = +props['j_OWNER HOUSING UNITS']; // total owner-occupied housing units
  const whiteRate = +props['j_WHITE HOMEOWNERSHIP RATE'];
  const safe = v => isFinite(v) && v !== 0;


  // Add a derived value only if data is valid
  props['j_SHARE_OWNER_WHITE'] =
    totalOwners ? +props['j_WHITE OWNER HOUSING UNITS'] / totalOwners : NaN;
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

    // 🔁 Derived rate difference with White
    const raceRate = (key) =>
    safe(+props[key]) && safe(whiteRate) ? +props[key] - whiteRate : NaN;

  props['DIFF_BLACK_WHITE'] = raceRate('j_BLACK HOME OWNERSHIP RATE');
  props['DIFF_ASIAN_WHITE'] = raceRate('j_ASIAN HOMEOWNERSHIP_RATE');
  props['DIFF_AMERICAN_INDIAN_WHITE'] = raceRate('j_AMERICAN INDIAN HOMEOWNERSHIP_RATE');
  props['DIFF_NATIVE_HAWAIIAN_WHITE'] = raceRate('j_NATIVE HAWAIIAN HOMEOWNERSHIP_RATE');
  props['DIFF_OTHER_WHITE'] = raceRate('j_OTHER RACE HOMEOWNERSHIP RATE');
});


    } catch (err) {
      return console.error('Error loading GeoJSON:', err);
    }

    // 2️⃣ Seed your stores
    geoDataStore.set(geoData);
    const cities = Array.from(new Set(geoData.features.map(f => f.properties.TOWN20)));
    cityList.set(cities);

  //   // 3️⃣ Build the initial color scale & render
  //   colorScale = createOwnerRateScale(geoData.features, selectedRateType);
  //   renderMap();
  // });

  // // re-render on rate type change
  // $: if (geoData && selectedRateType) {
  //   colorScale = createOwnerRateScale(geoData.features, selectedRateType);
  //   renderMap();
  // }

  if (showShare) {
    colorScale = createShareScale(geoData.features, selectedRateType);
  } else {
    colorScale = createDifferenceScale(geoData.features, selectedRateType);
  }
  renderMap();
});

$: if (geoData && selectedRateType) {
  if (showShare) {
    colorScale = createShareScale(geoData.features, selectedRateType);
  } else {
    colorScale = createDifferenceScale(geoData.features, selectedRateType);
  }
  renderMap();
}

  // re-render on city selection change
  $: if ($selectedCity && geoData && svgEl && tooltipEl) {
  selectedFeature = geoData.features.find(
    f => f.properties.TOWN20.trim() === $selectedCity.trim()
  );

  if (selectedFeature) {
    const pathGen = d3.geoPath().projection(
      d3.geoMercator().fitSize([width, height], geoData)
    );

    const [x, y] = pathGen.centroid(selectedFeature);
    const val = +selectedFeature.properties[selectedRateType];

    let content = `<strong>${selectedFeature.properties.TOWN20}</strong><br/>`;

    if (showShare) {
      content += `Share of ${selectedRace} homeowners: ${isNaN(val) ? 'N/A' : (val * 100).toFixed(2) + '%'}`;
    } else {
      if (isNaN(val)) {
        content += 'Data unavailable or selected race has 0 homeownership in this city.';
      } else if (val > 0) {
        content += `${selectedRace} homeownership rate is ${(val * 100).toFixed(2)} percentage points higher than White.`;
      } else if (val < 0) {
        content += `White homeownership rate is ${(Math.abs(val) * 100).toFixed(2)} percentage points higher than ${selectedRace}.`;
      } else {
        content += `${selectedRace} and White homeownership rates are equal.`;
      }
    }

    d3.select(tooltipEl)
      .style('opacity', 1)
      .html(content)
      .style('left', `${svgEl.getBoundingClientRect().left + x + 10}px`)
      .style('top', `${svgEl.getBoundingClientRect().top + y - 30}px`);
  }

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
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .html(''); // clear

    // draw each tract
    svg
      .selectAll('path')
      .data(geoData.features)
      .join('path')
        .attr('d', pathGen)
        .attr('fill', d => {
          const v = +d.properties[selectedRateType];
          if (!isFinite(v) || v === 0) {
        return 'rgba(200, 200, 200, 0.4)';
    }
    return colorScale(v);
})
        .attr('stroke', d =>
      selectedFeature && d.properties.TOWN20 === selectedFeature.properties.TOWN20
        ? 'red'
        : '#fafafa'
    )

        .attr(
          'stroke-width',
          d =>
            selectedFeature &&
            d.properties.TOWN20 === selectedFeature.properties.TOWN20
              ? 2
              : 0.5
        )
        .attr('opacity', d =>
  selectedFeature && d.properties.TOWN20 === selectedFeature.properties.TOWN20
    ? 1
    : 0.4
)
      .on('mouseover', (evt, d) => {
        const city = d.properties.TOWN20;
const val = +d.properties[selectedRateType];
let content = `<strong>${city}</strong><br/>`;

if (showShare) {
  // Racial share case
  content += `Share of ${selectedRace} homeowners: ${isNaN(val) ? 'N/A' : (val * 100).toFixed(2) + '%'}`;
} else {
  // Difference-from-white case
  if (!isFinite(val) || val === 0) {
    content += `Data unavailable or there is no ${selectedRace} homeownership in this city.`;
  } else if (val > 0) {
    content += `${selectedRace} homeownership rate is ${(val*100).toFixed(2)} percentage points higher than White.`;
  } else if (val < 0) {
    content += `White homeownership rate is ${(Math.abs(val)*100).toFixed(2)} percentage points higher than ${selectedRace}.`;
  } else {
    content += `${selectedRace} and White homeownership rates are equal.`;
  }
}

d3.select(tooltipEl)
  .style('opacity', 1)
  .html(content)
  .style('left', evt.pageX + 10 + 'px')
  .style('top', evt.pageY + 10 + 'px');

        // fade others
        svg
          .selectAll('path')
          .transition()
          .duration(200)
          .style('opacity', p =>
            p === d ? 1 : 0.3
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
          .style('opacity', 0.7);
      })
      .on('click', (evt, d) => {
    const town = d.properties.TOWN20;
    if (['WAYLAND', 'WESTON'].includes(town)) {
      evt.stopPropagation();
      return; // ❌ Do nothing for these towns
    }

    evt.stopPropagation();
    selectedCity.set(town);
});

    // clear selection on background click
    svg.on('click', () => {
      selectedFeature = null;
      selectedCity.set('');
      renderMap();
    });
    drawLegend(colorScale, svg, 45, 560, 120, 6);
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
    .attr('font-size', '7px')
    .style('fill', 'white') 
    .text(d => (d * 100).toFixed(0) + '%');
}

</script>

<h1>Mapping Contemporary Homeownership in Middlesex County</h1>

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
  <span class="toggle-label">{showShare ? 'Racial share among total homeowners ' : 'Difference from White Homeownership Rate'}</span>
</div>

  <button class="insight-fab" on:click={() => showInsights = !showInsights}>Key Insights</button>

{#if showInsights}
  <div class="insight-popup">
    <div class="popup-content">
      <h2>Key Insights</h2>
      <p>1. <span class="highlight-text">Predominantly White Population:</span> Demographically, Middlesex County is mostly white, with small racial minority populations.<br><br>
        2. <span class="highlight-text">Racial Disparities in Homeownership:</span> White homeownership rates are significantly higher than other racial groups across most of Middlesex County. The darker the red, the greater the disparity between white homeownership and that of other racial groups.
        <br><br>
        3.<span class="highlight-text">Rate by Race:</span> Homeownership rates reflect race-specific data; even in instances where a non-white population shows a high rate of homeownership, the overall county remains predominantly white, reflecting majority white homeownership dynamics.
        <br><br>
        4. <span class="highlight-text">Income Disparities:</span> Median income for homeowners is significantly higher than for renters, highlighting how homeownership is a cause and symptom of entrenched exclusion from intergenerational wealth-building on the basis of race. 

      </p>
       <!-- Add the link button here -->
    <a href="/reading_list" class="reading-list-btn">
      Head to the reading list to learn more about the impacts of historical discriminatory practices on contemporary homeownership
    </a>

    <!-- Close button -->
    <button class="close-btn" on:click={() => showInsights = false}>Close</button>
    </div>
  </div>
{/if}

<svg bind:this={svgEl}></svg>
<div bind:this={tooltipEl} class="tooltip"></div>

<p class="source">
  Source: ACS data (2019–2023)
</p>

<style>
  svg {
    margin: auto;
    width: 100%;
  height: auto;
  display: block;
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
    color: white;
    font-family: 'Helvetica';

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

h1, h2, p, label, select, option, toggle-label {
  color: #fff;
  background-color: #000;
  font-family: 'Helvetica';
}
h1{
  font-size: 1.9rem;
}
.insight-fab {
  position: absolute;
  bottom: 8rem;
  left: 4rem;
  padding: 0.75rem 1.5rem;
  background-color: #A91B0D;
  color: white;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;

  cursor: pointer;
  z-index: 9999;
  white-space: nowrap;
  visibility: visible;
  opacity: 0.7;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.insight-fab:hover {
  background-color: #A91B0D;
  opacity: 1;
  color: white;
}

/* Popup styles */
.insight-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  background-color: rgba(0, 0, 0, 0.8);
}

.popup-content {
  background-color: black;
  color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 80%;
  max-width: 800px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 2px solid #A91B0D;
}

.popup-content h2 {
  margin-top: 0;
}

.close-btn {
  display: block;
  margin: 1rem auto 0 auto;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color:#555; 
  color: white; 
  border-radius: 4px;
  cursor: pointer;
}

.close-btn:hover {
  background-color: #8A160A;
}
.highlight-text {
  color: #A91B0D; /* You can change this to any color you like */
  font-weight: bold; /* Optional to make it stand out */
}
.reading-list-btn {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background-color: white;
  color: #A91B0D;
  border: 2px solid #A91B0D;
  border-radius: 6px;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.3s, color 0.3s;
}

.reading-list-btn:hover {
  background-color: #A91B0D;
  color: white;
}

</style>
