<script>
    import BarChart from './BarChart.svelte';

    const decades = [1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];
  </script>

  <main>
    <h1>Timeline</h1>
    {#each decades as d}
      <h1>{d}</h1>
      <BarChart csvPath='public/data/race_by_decade.csv' title="Race Distribution" color="#4CAF50" decade={d} />
      <BarChart csvPath="/HOMEOWNERSHIP.csv" title="Homeownership" color="#2196F3" decade={d} />
      <BarChart csvPath="/HOME VALUE.csv" title="Home Value" color="#FF9800" decade={d} />
    {/each}
  </main>

<style>
</style>
