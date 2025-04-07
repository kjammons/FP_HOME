<script>
  import { onMount } from 'svelte';
  import { selectedCity, cityList, geoDataStore } from '../stores/state.js';
  import { derived } from 'svelte/store';
  import BarGraph from './BarGraph.svelte';

  // Subscribe to the dynamic city list
  let cities = [];
  cityList.subscribe(value => {
    cities = value;
  });

  let currentCity = "";
  // Update the shared selectedCity store
  $: selectedCity.set(currentCity);

  // Derived store: get the feature from geoDataStore that matches the currentCity.
  // (Assumes that each feature's 'mapc_municipal' property is the city identifier.)
  const selectedFeature = derived(
    geoDataStore,
    ($geoDataStore, set) => {
      if ($geoDataStore && currentCity) {
        const feature = $geoDataStore.features.find(f => f.properties.mapc_municipal === currentCity);
        set(feature);
      } else {
        set(null);
      }
    }
  );
</script>

<div class="selection">
  <label for="city-select">Select a City:</label>
  <select id="city-select" bind:value={currentCity}>
    <option value="">-- Choose a city --</option>
    {#each cities as city}
      <option value={city}>{city}</option>
    {/each}
  </select>
</div>

{#if currentCity}
  {#if $selectedFeature}
    <div class="bargraph-container">
      <h2>{$selectedFeature.properties.mapc_municipal} Population</h2>
      <!-- Pass the historical population data to the bar graph component -->
      <BarGraph data={$selectedFeature.properties} />
    </div>
  {:else}
    <p>No data available for {currentCity}.</p>
  {/if}
{/if}

<style>
  .selection {
    margin-bottom: 20px;
    text-align: center;
  }
  label {
    font-size: 1rem;
    margin-right: 10px;
  }
  select {
    font-size: 1rem;
    padding: 5px;
  }
  .bargraph-container {
    padding: 10px;
    border: 1px solid #ccc;
    margin-top: 20px;
  }
</style>
