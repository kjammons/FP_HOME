<script>
  import MapView from './MapView.svelte';
  import Selection from './Selection.svelte';
  import TextBox from './TextBox.svelte'; 
  import OverlayMap from './OverlayMap.svelte';
  import '$lib/utils/tooltip.css';

  import { base } from '$app/paths';
</script>

<!-- (ideally move this into src/routes/+layout.svelte so all pages inherit it) -->
<svelte:head>
  <base href="{base}/" />
</svelte:head>

<main>
  <div class="container">
    <div class="map">
      <!-- <OverlayMap /> -->
      <MapView />
     
      
    </div>
    <div class="selection-panel">
      <Selection />
      <TextBox   />
    </div>
  </div>
</main>

<style>
  .container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    padding: 20px;
  }
  .map {
    flex: 1 1 60%;
  }
  .selection-panel {
    flex: 1 1 35%;
  }
</style>
