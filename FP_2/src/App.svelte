<script>
  import MapView from './components/MapView.svelte';
  import ControlPanel from './components/ControlPanel.svelte';
</script>

<main>
  <h1>Middlesex County </h1>
  <ControlPanel />
  <MapView />
</main>

<style>
  main {
    font-family: sans-serif;
    padding: 1em;
    max-width: 1000px;
    margin: auto;
  }
</style>

