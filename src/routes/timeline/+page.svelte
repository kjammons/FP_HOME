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
      'Racially restrictive covenants appeared in the late nineteenth century and spread rapidly in the 1920s after the Supreme Court banned racial zoning (Buchanan vs. Warely)',
      'Racially restrictive covenants upheld by the Supreme Court in Corrigan v. Buckley (1926).',
      'Black migration from the rural South to urban North, yet limited in Middlesex County as opposed to Suffolk County (Boston)',
      'Homeowners’ organizations and real estate boards turned to advocating for racial separation. '
    ],
    1930: [
      'Redlining institutionalized via HOLC & FHA “security” maps; Lexington, Belmont, Winchester, and Waltham were often labeled “desirable”',
      'Suburban areas in Middlesex County were heavily favored for new housing development and federal loan guarantees, but only for white buyers',
      'From 1934 on, the FHA recommended the inclusion of restrictive covenants in the deeds of homes it insured'
    ],
    1940: [
      'GI Bill legislation passed by Congress in 1944, offering low interest, zero down payment home loans for servicemen mortgages open vets, but Black veterans in MA often shut out by discriminatory lending.',
      'White families build suburban wealth, while many Black families remain renters in segregated neighborhoods.',
      'MA Chapter 151B (1946) passes, and Shelley v. Kraemer (1948) makes covenants unenforceable.'
    ],
    1950: [
      'Homeownership boom began after World War II',
      'Federal-Aid Highway Act of 1956 shaping suburban development: rRoute 128/I-495 spur white flight to suburbs like Lincoln & Weston',
      'Exclusionary zoning (large‐lot, single‐family) making land and housing more expensive, which excluded low-income households, often disproportionately nonwhite',
    ],
    1960: [
      'Civil rights activists held Open Housing Marches in Mattapan & Hyde Park demanding fair and equal access to housing regardless of race',
      '70% of Black Bostonians confined to a few neighborhoods amid intensifying white flight.',
      'Federal Fair Housing Act (1968) bans discrimination in housing, ending redlining (on paper), but enforcement remains weak'
    ],
    1970: [
      'Federal court ordered the desegregation of Boston public schools through busing (1974), which sparked violent protests and led many white families to move to the suburbs. ',
      'Further entrenched racial lines: urban areas were seen as Black, suburbs as white- towns in Middlesex County reaching 98% white population',
      'MA Comprehensive Permit Act (1969) anti-snob zoning, overriding exclusionary local zoning regulations, enables affordable units in resistant towns.',
      'Home Mortgage Disclosure Act (1975) & CRA (1977) made redlining patterns visible for the first time. '
    ],
    1980: [
      '11988- NAACP filed a landmark lawsuit against the Boston Housing Authority (BHA), alleging widespread racial discrimination in public housing administration by maintaining segregated waiting lists, which disproportionately assigned Black applicants to developments in poor condition or high-crime areas, while reserving better-maintained units in white neighborhoods for white families. ',
      'Fair Housing Act amendments (1988) add familial & disability protections and strengthen enforcement.',
    ],
    1990: [
      'HUD finds systemic discrimination in Boston public housing after forced integration fallout.',
      'HMDA data (1992) expose mortgage‐denial gaps; community reinvestment agreements follow.',
      'Despite efforts, the Black-white homeownership gap remains wide by decade’s end.'
    ],
    2000: [
      'Chapter 40B (MA Affordable Housing Act) expands low-income units across resistant towns.',
      'Housing bubble doubles prices from 1995 to 2000, displacing working-class residents.',
      'Median home prices in towns like Belmont, Arlington, and Lexington rose from ~$200,000 to over $500,000 between 1995 and 2005, increasing the wealth building gap between homeowners and renters. '
    ],
    2010: [
      'Post-2008 crash recovery stabilizes home prices—but gentrification displaces longtime residents.',
      'The Dodd-Frank Act (2010) tightens MA lending standards after a surge in foreclosures especially in gateway cities like Lawrence, Lowell, Lynn, Chelsea, Brockton, and Worcester',
      'Inclusionary zoning & anti-displacement task forces emerge amid persistent segregation.'
    ],
    2020: [
      'Housing Choice law (Jan 2021) lowers zoning vote thresholds, facilitating zoning changes in towns with high demand and high exclusion, & mandates multifamily near MBTA stations, impacting transit-served towns like Arlington, Acton, Malden, and Waltham',
      'COVID-19 eviction moratorium protects minority renters in Boston & across MA.',
      'Ongoing reforms push inclusive development & stronger fair housing enforcement.',
    ]
  };
</script>


{#if showLanding}
  <div class="landing">
    <div class="landing-content">
      <h1>History of Homeownership in Middlesex County</h1>
      <p>Recognizing the historically exclusionary role of restrictive covenants in shaping access to homeownership in Middlesex County, let’s take a closer look together at how racial demographics and homeownership patterns have evolved over time!</p>
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
      <HomeownBar year={selectedYear} />
    </aside>

    <main class="timeline">
      {#each years as yr, i}
        <section use:collect={i} class:active={i === currentIndex}>
          <div class="description">
            <h2>{yr}</h2>
            {#each descriptions[yr] as bullet}
              <p>{bullet}</p>
            {/each}
          </div>
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
          Over the past few decades, while homeownership rates for both the general population and white residents in Middlesex County have steadily risen—from 37% to 62% overall, and from 47% to 67% for white residents—the Black homeownership rate has remained stagnant at around 30%. Despite increased access to mortgage loans for minority groups, the disparity in homeownership rates between minority groups, particularly Black people, and white residents persists, underscoring the enduring legacy of historical injustices. This trend is also linked to the historically small Black population in Middlesex County, which totaled 84,670 residents in 2020. Our project aims to highlight the intergenerational impacts of restrictive covenants, which systematically excluded people of color from the wealth-building opportunities that white homeowners were able to benefit from through home equity.
        </p>
        <p><em>*All data presented are sourced from the U.S. Decennial Census, conducted by the U.S. Census Bureau since 1790.*</em></p>
        <p>Explore contemporary homeownership dynamics:</p>
        <a href="white_homeownership">
          <img src={mapPreview} alt="Homeownership Map" />
        </a>
        <p><small>Click the map to continue your journey.</small></p>
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
    border-left: 4px solid #f5d262;
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    margin-bottom: 2rem;
  }

  .description h2 {
    margin-top: 0;
    font-variant: small-caps;
    font-size: 2rem;
    font-size: 120%;
    font-family: raleway;
    color: #fff;
  }

  .description p {
    margin: 1rem 0 0 0;
    font-size: 120%;
    font-family: raleway;
    color: #fff;
  }

  .popup {
  margin-top: 2rem;
  background: rgba(250, 243, 224, 0.95);
  padding: 1.5rem; /* increased padding */
  border: 1px solid #d4b97f;
  border-radius: 6px;
  box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.2);
  max-width: 360px; /* increased width */
  text-align: center;
  font-size: 1rem; /* larger text */
}


  .popup p {
    margin: 0.5rem 0;
    font-style: italic;
  }

  .popup img {
  display: block;
  margin: 0.75rem auto;
  width: 90%; /* scale within larger box */
  max-width: 320px;
  border: 1px solid #d4b97f;
  border-radius: 6px;
  cursor: pointer;
}

.fullscreen-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 2rem;
}

.popup.centered {
  background: rgba(250, 243, 224, 0.95);
  padding: 2rem;
  border-radius: 10px;
  max-width: 800px;
  width: 100%;
  color: #000;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
  text-align: center;
}


@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

  .wrapper {
    display: flex;
    height: 100vh;
    overflow: hidden;
    background-image: url('src/lib/assets/data/1226-454.jpg');
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
  }

  .landing {
  position: fixed;
  inset: 0;
  background: url('static/images/Middlesexmap.jpg') no-repeat center center;
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
  font-family: raleway;
}

.landing-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  font-family: raleway;
  color: white;
}

.landing-content button {
  background: #B20000;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-family: raleway;
  font-size: 200%;
}

.landing-content button:hover {
  background: #B20000;
}


</style>
