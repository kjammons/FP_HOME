<script>
  import { selectedMunicipality, selectedVariable } from '../stores/state.js';

  // Update these arrays to reflect the CSV headers you want to visualize.
  const municipalities = ['All', 'Lowell', 'Dracut', 'Wilmington', 'Malden'];
  const variables = ['OWNER HOUSING UNITS', 'MEDIAN HOUSEHOLD_INCOME', 'WHITE_POP'];

  function handleMunicipalityChange(event) {
    selectedMunicipality.set(event.target.value);
  }
  function handleVariableChange(event) {
    selectedVariable.set(event.target.value);
  }
</script>

<div class="control-panel">
  <label>
    Municipality:
    <select on:change={handleMunicipalityChange}>
      {#each municipalities as m}
        <option value={m}>{m}</option>
      {/each}
    </select>
  </label>
  <label>
    Variable:
    <select on:change={handleVariableChange}>
      {#each variables as v}
        <option value={v}>{v}</option>
      {/each}
    </select>
  </label>
</div>

<style>
  .control-panel {
    margin-bottom: 1em;
    text-align: center;
  }
  label {
    margin-right: 1em;
    font-size: 1rem;
  }
  select {
    margin-left: 0.5em;
  }
</style>
