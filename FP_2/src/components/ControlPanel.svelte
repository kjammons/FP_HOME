<script>
    import { selectedVariable, selectedRegion } from '../stores/state.js';
  
    const variables = ['homeownership', 'housing_value', 'housing_type'];
  
    function handleVariableChange(event) {
      selectedVariable.set(event.target.value);
    }
  
    function toggleRegion() {
      selectedRegion.update(region => region === "Middlesex" ? "DracutLowell" : "Middlesex");
    }
  </script>
  
  <div class="controls">
    <select on:change={handleVariableChange}>
      {#each variables as variable}
        <option value={variable}>{variable}</option>
      {/each}
    </select>
  
    <button on:click={toggleRegion}>
      Toggle Region View
    </button>
  </div>
  