<script>
  import MapView from './components/MapView.svelte';
  import Selection from './components/Selection.svelte';
  import TextBox from './components/TextBox.svelte'; 


</script>

<main>
  <div class="container">
    <div class="map">
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
