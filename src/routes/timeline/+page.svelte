<script>
    import RaceBarChart from './RaceBarChart.svelte';
    import HomeownBar from './HomeownBar.svelte';
    let selectedYear = 2020;

    const decades = [1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];
  </script>

  <h1>Timeline</h1>

  <select bind:value={selectedYear}>
    {#each decades as d}
      <option value={d}>{d}</option>
    {/each}
  </select>

  <RaceBarChart year={selectedYear} />
  <HomeownBar year={selectedYear} />
