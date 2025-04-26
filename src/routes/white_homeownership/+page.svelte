<script>

  import MapView from '../../lib/components/MapView.svelte';
  import Selection from '../../lib/components/Selection.svelte';
  import TextBox from '../../lib/components/TextBox.svelte'; 
  import OverlayMap from '../../lib/components/OverlayMap.svelte';
  
</script>

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
