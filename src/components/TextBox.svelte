<!-- src/components/TextBox.svelte -->
<script>
  export let text = `
    <p>This project is inspired by and developed in accordance with the long-term goals of the <a href="https://dusp.mit.edu/projects/massachusetts-covenants-project" target="_blank" rel="noopener noreferrer"> Massachusetts Covenants Project</a>. Racially restrictive covenants are one of the hidden histories of housing discrimination. They proliferated separately from government-sponsored means of discrimination like redlining or exclusionary zoning, embodying a populist, insidious desire of neighbors to exclude neighbors. Today, the covenants the “run with the land,” alive in the property deeds although now ruled unenforceable and illegal [Hansberry v. Lee (1940); Shelley v. Kraemer (1948); Fair Housing Act (1968)].</p>
    
    <p>With this grounding, “Who lives and who owns in Middlesex County?” considers the contemporary effects of historically harmful discriminatory housing practices. With this visualization, we present disaggregated American Community Survey (ACS) data to give users agency to understand the landscapes of homeownership and race across the county, which is informed by the current extent of archival study for the Massachusetts Covenants Project. The framing of white and non-white is situated within an investigation of the social construction of whiteness, which the restrictive covenants expose as malleable and weaponized according to changing biases. As researchers, we believe this presentation of present dynamics cannot be separated from the discriminatory practices that brought it into being by design.</p>

    <p>This visualization was designed and implemented by Kristen Ammons, Shreya Bansal, Emilia Charno, and Marine Gapihan.</p>    `
;
</script>

<div class="text-box">
  {@html text}
</div>

<style>
  div {
    font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
    font-size: 70%;
  }

  .text-box {
    padding: 10px;
    background-color: #f8f8f8;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    color: #333;
    margin-top: 20px;
  }

  .text-box p {
    margin-bottom: 1em;
  }
</style>
