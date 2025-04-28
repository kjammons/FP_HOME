<!-- src/routes/timeline/+page.svelte -->
<script>
import { onMount } from 'svelte';
import { base } from '$app/paths';
import RaceBarChart from './RaceBarChart.svelte';
import HomeownBar from './HomeownBar.svelte';
import mapPreview from '$lib/assets/images/map.png';

const backgroundUrl = `${base}/data/1226-454.jpg`;  // <-- FIX here

  // decades
  const years = [1920,1930,1940,1950,1960,1970,1980,1990,2000,2010,2020];
  let currentIndex = 0;
  let selectedYear = years[0];

  // collect step elements for IntersectionObserver
  let stepEls = [];
  let observer;
  function collect(el,i) {
    stepEls[i] = el;
    observer?.observe(el);
    return {
      destroy() {
        observer?.unobserve(el);
        stepEls[i] = null;
      }
    }
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
    return () => observer.disconnect();
  });

  // full bullet list for each decade
  const descriptions = {
    1920: [
      'Racially restrictive covenants everywhere, upheld by Corrigan v. Buckley (1926).',
      'Real estate boards push covenants nationwide; by 1940 ~80% of urban properties excluded Black families.',
      'Boston neighborhoods also used these clauses to keep areas exclusively white.'
    ],
    1930: [
      'Redlining institutionalized via HOLC & FHA “security” maps; Roxbury, Dorchester, Hyde Park marked high‐risk.',
      'FHA policies favor all‐white suburbs and label mixed areas “inharmonious,” driving white residents outward.',
      'Public housing under the 1937 Housing Act built segregated projects via local control & low‐income caps.'
    ],
    1940: [
      'GI Bill mortgages open vets—but Black veterans in MA often shut out by discriminatory lending.',
      'White families build suburban wealth, while many Black families remain renters in segregated neighborhoods.',
      'MA Chapter 151B (1946) passes, and Shelley v. Kraemer (1948) makes covenants unenforceable.'
    ],
    1950: [
      'Postwar boom & Route 128/I-495 spur white flight to suburbs like Lincoln & Weston.',
      'Exclusionary zoning (large‐lot, single‐family) soars home prices and bars minority families.',
      '1958 West End urban renewal demolishes “slums,” displacing thousands into already-crowded, segregated areas.'
    ],
    1960: [
      'Open-housing marches held in Mattapan & Hyde Park as Black migration north continues.',
      '70% of Black Bostonians confined to a few neighborhoods amid intensifying white flight.',
      'Federal Fair Housing Act (1968) bans discrimination—but enforcement remains weak.'
    ],
    1970: [
      '1974 court-ordered busing triggers violent protests & accelerates white exodus; suburbs become ~98% white.',
      'Chapter 40B (1969) anti-snob zoning enables affordable units in resistant towns.',
      'Home Mortgage Disclosure Act (1975) & CRA (1977) begin chipping away at redlining.'
    ],
    1980: [
      '1988 NAACP lawsuit forces BHA to integrate waiting lists and compensate excluded applicants.',
      'Fair Housing Act amendments (1988) add familial & disability protections and strengthen enforcement.',
      'MA aligns earlier state sex, marital status & age protections with federal law.'
    ],
    1990: [
      'HUD finds systemic discrimination in Boston public housing after forced integration fallout.',
      'HMDA data (1992) expose mortgage‐denial gaps; community reinvestment agreements follow.',
      'Despite efforts, the Black-white homeownership gap remains wide by decade’s end.'
    ],
    2000: [
      'Chapter 40B (MA Affordable Housing Act) expands low-income units across resistant towns.',
      'Housing bubble doubles prices from 1995 to 2000, displacing working-class residents.',
      'Roxbury & Dorchester see state-led affordable-housing redevelopment efforts.'
    ],
    2010: [
      'Post-2008 crash recovery stabilizes home prices—but gentrification displaces longtime residents.',
      'Dodd-Frank tightens MA lending standards after surge in foreclosures.',
      'Inclusionary zoning & anti-displacement task forces emerge amid persistent segregation.'
    ],
    2020: [
      'Housing Choice law (Jan 2021) lowers zoning vote thresholds & mandates multifamily near MBTA stations.',
      'COVID-19 eviction moratorium protects minority renters in Boston & across MA.',
      'Ongoing reforms push inclusive development & stronger fair housing enforcement.',
      'Over the past few decades, while homeownership rates for both the general population and white residents in Middlesex County have steadily risen— from 37% to 62% overall, and from 47% to 67% for white residents—the Black homeownership rate has remained stagnant at around 30%. Despite increased access to mortgage loans for minority groups, the disparity in homeownership rates between minority groups, particularly Black people, and white residents persists, underscoring the enduring legacy of historical injustices. This trend is also linked to the historically small Black population in Middlesex County, which totaled 84,670 residents in 2020. Our project aims to highlight the intergenerational impacts of restrictive covenants, which systematically excluded people of color from the wealth-building opportunities that white homeowners were able to benefit from through home equity.'
    ]
  };
</script>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: Courier;
    background: #faf3e0;
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
    font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
    color: #fff;
  }

  .description p {
    margin: 1rem 0 0 0;
    font-size: 120%;
    font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
    color: #fff;
  }

  .popup {
    margin-top: 2rem;
    background: rgba(250, 243, 224, 0.95);
    padding: 1rem;
    border: 1px solid #d4b97f;
    border-radius: 4px;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.15);
    max-width: 240px;
    text-align: center;
  }

  .popup p {
    margin: 0.5rem 0;
    font-style: italic;
  }

  .popup img {
    display: block;
    margin: 0.5rem auto;
    width: 100%;
    border: 1px solid #d4b97f;
    border-radius: 4px;
    cursor: pointer;
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
</style>

<div class="wrapper" style="background-image: url('{backgroundUrl}')">
  <aside class="sidebar">
    <RaceBarChart year={selectedYear} />
    <HomeownBar year={selectedYear} />
  </aside>

  <main class="timeline">
    <section class="intro">
      <div class="description">
        <h2>Introduction</h2>
        <p>Let’s take a look at how racial demographics and homeownership by race has evolved overtime in Middlesex County! <br><br>
          *Note how the category names have changed from one decade to the next in a reflection of past and current politics, science and public attitudes. 
          </p>
      </div>
    </section>

    {#each years as yr, i}
      <section use:collect={i} class:active={i === currentIndex}>
        <div class="description">
          <h2>{yr}</h2>
          {#each descriptions[yr] as bullet}
            <p>{bullet}</p>
          {/each}

          {#if i === years.length - 1}
            <div class="popup">
              <p>Explore who lives and who owns in Middlesex County today:</p>
              <a href="white_homeownership">
                <img src={mapPreview} alt="Homeownership Map">
              </a>
              <p><small>Click the map to continue your journey.</small></p>
            </div>
          {/if}
        </div>
      </section>
    {/each}
  </main>
</div>
