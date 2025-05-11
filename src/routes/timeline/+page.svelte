<!-- src/routes/timeline/+page.svelte -->
<script>
import { onMount } from 'svelte';
import { base } from '$app/paths';
import RaceBarChart from './RaceBarChart.svelte';
import HomeownBar from './HomeownBar.svelte';
import mapPreview from '$lib/assets/images/map.png';
    import { fade } from 'svelte/transition';

const backgroundUrl = `${base}/data/1226-454.jpg`; 
const landingUrl =  `${base}/data/Middlesexmap.jpg`; 

let showLanding = true;
let sentinel;
let finalSummaryVisible = false;


  // decades
  const years = [1920,1930,1940,1950,1960,1970,1980,1990,2000,2010,2020];
  let currentIndex = 0;
  let selectedYear = years[0];

  // collect step elements for IntersectionObserver
  let stepEls = [];
  let observer;
  let summaryObserver;

  function collect(el, i) {
    stepEls[i] = el;
    observer?.observe(el);
    return {
      destroy() {
        observer?.unobserve(el);
        stepEls[i] = null;
      }
    };
  }

  onMount(() => {
    observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const idx = stepEls.indexOf(e.target);
            if (idx !== -1) {
              currentIndex = idx;
              selectedYear = years[idx];
            }
          }
        });
      },
      { threshold: 0.5 }
    );
    stepEls.forEach(el => el && observer.observe(el));

    return () => {
      observer.disconnect();
      if (summaryObserver) summaryObserver.disconnect();
    };
  });

  $: if (sentinel) {
    if (summaryObserver) summaryObserver.disconnect();
    summaryObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          finalSummaryVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.5 }
    );
    summaryObserver.observe(sentinel);
  }
  // full bullet list for each decade
  const descriptions = {
    1920: [
      'Although there are varying accounts, racially restrictive covenants emerged as early as the mid-19th century. They gained widespread use in the 1920s, particularly as a means to continue racial housing discrimination after the <span style="font-weight:bold; color:#A91B0D;">Supreme Court struck down racial zoning laws in Buchanan v. Warley (1917). In Corrigan v. Buckley (1926), </span> the Supreme Court upheld covenants’ legality, legitimizing their role in housing discrimination. Homeowners’ associations, real estate boards, and private citizens increasingly capitalized on these opportunities to enact racial separation through private means, such as restrictive covenants, to preserve segregated neighborhoods. '
    ],
    1930: [
      ' The creation of Home Owners’ Loan Corporation (HOLC) and Federal Housing Administration (FHA) <span style="font-weight:bold; color:#A91B0D;">“security” maps</span> institutionalized the practice we know today as<span style="font-weight:bold; color:#A91B0D;"> “redlining.”</span> These maps systematically graded neighborhoods based on perceived lending risk. Suburban towns in Middlesex County—such as Lexington, Belmont, Winchester, and Waltham—were frequently labeled as “still desirable,” reinforcing their preferential status. These areas were heavily targeted for new housing development, but access was largely restricted to white buyers. Beginning in 1934, the FHA explicitly recommended that restrictive covenants be included in the deeds of homes it insured, further entrenching racial segregation in suburban housing markets.'
    ],
    1940: [
      'The GI Bill, passed by Congress in 1944, offered low-interest home loans and other benefits to returning veterans. However, in Massachusetts as across the country, Black veterans were often denied these opportunities due to discriminatory lending practices and exclusionary policies. As a result, even more white families were able to build generational wealth through suburban homeownership, while many Black families remained renters in segregated urban neighborhoods. Although the Supreme Court’s decision in <span style="font-weight:bold; color:#A91B0D;">Shelley v. Kraemer (1948), ruled that racially restrictive covenants were not legally enforceable,</span> the legacy of these practices continued to shape patterns of residential segregation and inequality. The unenforceable ruling also <span style="font-weight:bold; color:#A91B0D;">did not remove restrictive covenants from property deeds, and the covenants “run with the land” to this day.</span> '  ],
    1950: [
      ' The post–World War II era ushered in a <span style="font-weight:bold; color:#A91B0D;">major homeownership boom,</span> driven partially by federal policies and economic expansion. The Federal-Aid Highway Act (1956) played a critical role in shaping suburban development, enabling <span style="font-weight:bold; color:#A91B0D;">white flight from urban centers to suburban peripheries.</span> As these communities grew, <span style="font-weight:bold; color:#A91B0D;">exclusionary zoning</span> practices—particularly large-lot, single-family zoning—became widespread, barring low-income households from accessing suburban housing. These policies disproportionately excluded non-white residents, reinforcing the momentum of racial and economic segregation in the expanding suburbs.'
    ],
    1960: [
      'Civil rights activists organized Open Housing Marches in neighborhoods like Mattapan and Hyde Park to <span style="font-weight:bold; color:#A91B0D;">demand fair and equal access to housing for all,</span> regardless of race. Sustained efforts nationally culminated in the passage of the <span style="font-weight:bold; color:#A91B0D;">federal Fair Housing Act (1968),</span> which formally outlawed housing discrimination and marked the <span style="font-weight:bold; color:#A91B0D;">official end of redlining policies—at least on paper.</span> Disappointingly, enforcement of the law remained weak, and many discriminatory practices persisted if only in more covert forms.'
    ],
    1970: [
      'In 1974, a federal court ordered the desegregation of Boston public schools through a busing mandate, prompting intense backlash and violent protests. In response, many white families relocated to the suburbs, further entrenching regional racial divisions<span style="font-weight:bold; color:#A91B0D;"> along urban-suburban lines.</span> Although <span style="font-weight:bold; color:#A91B0D;">the Massachusetts Comprehensive Permit Act (1969)</span> aimed to counteract exclusionary zoning by allowing developers to bypass restrictive local regulations and build affordable housing, its implementation faced significant resistance in many suburban towns, limiting its impact on promoting racial and economic integration in these geographies.',
    ],
    1980: [
      'In this period, the NAACP prominently sued the Boston Housing Authority (1988), alleging <span style="font-weight:bold; color:#A91B0D;">widespread racial discrimination in their administration of public housing.</span> NAACP lawyers pointed to highly segregated waiting lists, which disproportionately assigned Black applicants to developments in poor condition or high-crime areas, while reserving better-maintained units in white neighborhoods for white families. ',
    ],
    1990: [
      'In the 1990s, the U.S. Department of Housing and Urban Development (HUD) finds evidence of <span style="font-weight:bold; color:#A91B0D;">systemic discrimination within Boston’s public housing system.</span> In 1992, data from the Home Mortgage Disclosure Act (HMDA) revealed <span style="font-weight:bold; color:#A91B0D;">significant disparities in mortgage denial rates between Black and white applicants,</span> prompting the creation of community reinvestment agreements aimed at addressing these inequities. <span style="font-weight:bold; color:#A91B0D;">Despite these interventions, the Black-white homeownership gap remained substantial by the end of the decade, highlighting the enduring impact of structural barriers to housing equity.</span>'
    ],
    2000: [
      'Massachusetts’ Chapter 40B, also known as <span style="font-weight:bold; color:#A91B0D;">the Affordable Housing Act,</span> sought to expand low-income housing across municipalities that had historically resisted such development. However, <span style="font-weight:bold; color:#A91B0D;">during the housing bubble of the late 1990s,</span> home prices in the region surged dramatically, displacing many working-class residents. Between 1995 and 2005, median home prices in suburban towns such as Belmont, Arlington, and Lexington skyrocketed from approximately $200,000 to over $500,000, <span style="font-weight:bold; color:#A91B0D;">exacerbating the wealth gap and deepening existing economic and racial segregation.</span>  '
    ],
    2010: [
      'In the wake of <span style="font-weight:bold; color:#A91B0D;">the 2008 financial crisis,</span> the housing market gradually stabilized, but the recovery period ushered in waves of gentrification that displaced many longtime residents. This was felt acutely in urban neighborhoods. <span style="font-weight:bold; color:#A91B0D;">The Dodd-Frank Act of 2010 imposed stricter lending standards in Massachusetts </span> in response to the foreclosure crisis, aiming to prevent similar financial instability in the future. Meanwhile, cities and towns began adopting <span style="font-weight:bold; color:#A91B0D;">inclusionary zoning policies and forming anti-displacement task forces</span> to address growing concerns around housing affordability and persistent patterns of racial and economic segregation.'
    ],
    2020: [
      '<span style="font-weight:bold; color:#A91B0D;">The MBTA Communities Law (2021)</span> was designed to facilitate zoning changes in communities with high housing demand and histories of exclusion. The law mandated <span style="font-weight:bold; color:#A91B0D;">the development of multifamily housing near MBTA stations in towns such as Arlington, Acton, Malden, and Waltham.</span> These reforms aim to promote more inclusive development and are accompanied by ongoing efforts to strengthen fair housing enforcement, <span style="font-weight:bold; color:#A91B0D;">addressing long-standing barriers to equitable access in Massachusetts housing landscape.</span>',
    ]
  };

  const extraContent = {
  1950: "In 1950, census data reflected a binary classification of 'white' versus 'non-white.” This reinforced racial hierarchies and obscured the distinct experiences of individual racial groups. ",
  1970: "As a result of post-war policies aimed at spurring homeownership, 59% of Middlesex County households are owner-occupied, close to the national average. However, homeownership in Middlesex County was overwhelmingly limited to white residents, resulting from a combination of discriminatory housing policies, lending practices, and local exclusionary zoning.",
  1990: "In this period, we observe that the Asian population surpasses the Black population in Middlesex County. Following the Vietnam War, Cambodian genocide, and Laotian civil war, the U.S. accepted large numbers of refugees from Southeast Asia. Geographies like Lowell and Lynn became key resettlement areas. At this time, white homeownership is 37% points higher than Black homeownership, reflecting a persistent and growing trend of racial disparity in homeownership rate.",
  2010: "From 1980-2010, white homeownership increased by 8% percentage points while that of Black households remained constant overtime (dropping at 25% in 1990). During this period, the total homeownership rate in Middlesex County aligns with both state and national trends, at around 60%.",
  2020: "In 2020, only about 5% of Middlesex County's population identified as Black or African American, compared to 25% in Suffolk County (Boston). This is only one example of how urban-suburban racial geographies in Massachusetts remain evident.  "
};

</script>


{#if showLanding}
  <div class="landing" style="background-image: url('{landingUrl}')">
    <div class="landing-content">
      <h1>History of Homeownership in Middlesex County</h1>
      <p>Given the historically exclusionary role of restrictive covenants in shaping access to homeownership in Middlesex County, let’s explore how racial demographics and homeownership patterns have changed over time.</p>
      <p><em>Please note: U.S. Census Bureau designations of race, ethnicity, and national origin change from one decade to the next, reflecting evolving cultural, political, and societal practices.</em></p>
      <button on:click={() => showLanding = false}>
        <strong>We invite you to explore those patterns with us!</strong>
      </button>
    </div>
  </div>
{:else}
  <div class="wrapper" style="background-image: url('{backgroundUrl}')">
    <aside class="sidebar">
      <RaceBarChart year={selectedYear} />
      <div style="margin-top: 4rem;">
      <HomeownBar year={selectedYear} />
    </aside>

    <main class="timeline">
      {#each years as yr, i}
        <section use:collect={i} class:active={i === currentIndex}>
          <div class="description">
            <h2>{yr}</h2>
            <p>What was happening?</p>
            {#each descriptions[yr] as bullet}
              <li>{@html bullet}</li>
            {/each}
          </div>

          {#if extraContent[yr]}
          <div class="description-secondary">
            <h2>What does the data tell us?</h2>
            <p>{@html extraContent[yr]}</p>
          </div>
        {/if}
        </section>
      {/each}

      <!-- 👇 Sentinel triggers final popup when it enters view -->
      <div bind:this={sentinel} style="height: 1px;"></div>
    </main>
  </div>

  {#if finalSummaryVisible}
  <div class="fullscreen-overlay" transition:fade>
    <div class="popup centered">
        <p>
          Over the past few decades, while homeownership rates for both the general population and white residents in Middlesex County have steadily risen—from 37% to 62% overall, and from 47% to 67% for white residents—black homeownership rate has remained stagnant at around 30%. <br>
          <br>
          Despite increased access to mortgage loans for minority groups, the disparity in homeownership rates between minority groups and white residents persists, underscoring the enduring legacy of historical injustices, including racially restrictive covenants.
        </p>
        <br>
        <h2>Now we invite you to explore contemporary homeownership dynamics!</h2>
        <a href="white_homeownership">
          <img src={mapPreview} alt="Homeownership Map" />
        </a>
        <p><small>Click the map to continue your journey.</small></p>
        <p><em>*All data presented were sourced from the U.S. Decennial Census, conducted by the U.S. Census Bureau since 1790</em></p>
      </div>
    </div>
  {/if}
{/if}

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: raleway;
    color: #333;
  }

  .sidebar {
    flex: none;
    width: 40%;
    background: rgba(0, 0, 0, 0.9);
    padding: 2rem 1rem;
    box-shadow: 2px 0 6px rgba(0, 0, 0, 0.05);
    overflow-y: auto;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .sidebar :global(.chart-container) {
    height: 380px;
    margin: 0;
  }

  .timeline {
    flex: 1;
    overflow-y: auto;
    scroll-behavior: smooth;
    scroll-padding-top: 30vh;
    padding: 1rem 2rem;
  }

  section {
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding: 2rem 0;
    opacity: 0.3;
    transition: opacity 0.4s ease;
  }

  section.active,
  section.intro {
    opacity: 1;
  }

  .description {
    max-width: 600px;
    background-color: rgba(0, 0, 0, 0.85);
    color: white;
    padding: 1.5rem;
    border-left: 4px solid #A91B0D;
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    margin-bottom: 2rem;
    margin-left: 5rem;
  }


  .description h2 {
    margin-top: 0;
    font-variant: small-caps;
    font-size: 2rem;
    font-size: 250%;
    font-family: Helvetica;
    color: #fff;
  }

  .description li {
    margin: 1rem 0 0 0;
    font-size: 120%;
    font-family: Helvetica;
    color: #fff;
  }

  .description p{
    margin: 1rem 0 0 0;
    font-size: 150%;
    font-family: Helvetica;
    color: #fff;
    font-weight: bold;
  }
  .description-secondary {
    max-width: 600px;
    background-color: rgba(0, 0, 0, 0.85);
    color: white;
    padding: 1.5rem;
    border-left: 4px solid #A91B0D;
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    margin-bottom: 2rem;
    margin-left: 5rem;
}

.description-secondary p{
  margin: 1rem 0 0 0;
    font-size: 120%;
    font-family: Helvetica;
    color: #fff;
}

.description-secondary h2{
  margin: 1rem 0 0 0;
    font-size: 150%;
    font-family: Helvetica;
    color: #fff;
}
section {
  display: flex;
  flex-direction: column; /* 👈 makes content stack vertically */
  align-items: flex-start;
  justify-content: center;
  padding: 2rem 0;
  min-height: 100vh;
  opacity: 0.3;
  transition: opacity 0.4s ease;
}



  .popup img {
  display: block;
  margin: 0.75rem auto;
  width: 90%; /* scale within larger box */
  max-width: 320px;
  border: 1px solid #A91B0D;
  border-radius: 6px;
  cursor: pointer;
}

.fullscreen-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 2rem;
}

.popup.centered {
  background: rgba(6, 6, 6, 0.95);
  padding: 2rem;
  border-radius: 10px;
  max-width: 800px;
  width: 100%;
  color: #000;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
  text-align: center;
  border-color: #A91B0D;
}

.popup.centered p{
  font-size: 2rem;
  margin-bottom: 1rem;
  font-size: 100%;
  font-family: Helvetica;
  color:white
}
.popup.centered em{
  font-size: 2rem;
  margin-bottom: 1rem;
  font-size: 85%;
  font-family: Helvetica;
  color:white;
  display:right
}
.popup.centered h2{
  font-size: 2rem;
  margin-bottom: 1rem;
  font-size: 120%;
  font-family: Helvetica;
  color:white
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

  .wrapper {
    display: flex;
    height: 100vh;
    overflow: hidden;

    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
  }

  .landing {
  position: fixed;
  inset: 0;
  background: no-repeat center center;
  background-size: cover;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.landing-content {
  text-align: center;
  background: rgba(0,0,0,0.7);
  padding: 2rem;
  border-radius: 8px;
  color: white;
  max-width: 800px;
}

.landing-content h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  font-size: 180%;
  font-family: Helvetica;
}

.landing-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  font-size: 120%;
  font-family: Helvetica;
  color: white;
}

.landing-content button {
  background: black;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 150%;
  font-family: Helvetica;
  opacity:1
}

.landing-content button:hover {
  background: #A91B0D;
  opacity:0.8
}


</style>
