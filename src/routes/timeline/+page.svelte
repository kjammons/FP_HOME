<!-- src/routes/timeline/+page.svelte -->
<script>
    import mapPreview from '$lib/assets/images/map.png';
    import { onMount } from 'svelte';
  
    const years = [1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];
    let currentIndex = 0;
    let stepEls = [];
    let observer;
  
    function collect(el, idx) {
      stepEls[idx] = el;
      if (observer) observer.observe(el);
      return {
        destroy() {
          if (observer) observer.unobserve(el);
          stepEls[idx] = null;
        }
      };
    }
  
    onMount(() => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const idx = stepEls.indexOf(entry.target);
              if (idx !== -1) currentIndex = idx;
            }
          });
        },
        { threshold: 0.8 }
      );
      stepEls.forEach(el => el && observer.observe(el));
      return () => observer.disconnect();
    });
  
    const descriptions = {
      1920: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      1930: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      1940: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
      1950: 'Duis aute irure dolor in reprehenderit in voluptate velit esse.',
      1960: 'Excepteur sint occaecat cupidatat non proident.',
      1970: 'Sunt in culpa qui officia deserunt mollit anim id est laborum.',
      1980: 'Curabitur pretium tincidunt lacus. Nulla gravida orci a odio.',
      1990: 'Nullam varius, turpis et commodo pharetra.',
      2000: 'Donec vitae sapien ut libero venenatis faucibus.',
      2010: 'Vestibulum ante ipsum primis in faucibus orci luctus et.',
      2020: 'Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi.'
    };
  </script>
  
  <style>
    /* Parchment background */
    :global(body) {
      margin: 0;
      padding: 0;
      font-family: 'Georgia', serif;
      background: #faf3e0;
      color: #333;
    }
  
    /* Scroll container with subtle edges */
    .container {
      overscroll-behavior-y: contain;  /* prevent accidental over-scroll beyond container */
      max-width: 900px;
      margin: 2rem auto;
      padding: 0 1rem;
      height: 100vh;
      overflow-y: auto;
      scroll-snap-type: y mandatory;
      scroll-padding-top: 30vh; /* pause higher on scroll */
      background: #faf3e0;
    }
  
    /* Year badge styled like an old label */
    .year-display {
      position: fixed;
      top: 50%;
      right: 2rem;
      transform: translateY(-50%);
      font-size: 3.5rem;
      font-variant: small-caps;
      font-weight: bold;
      text-align: center;
      background: rgba(250, 243, 224, 0.9);
      padding: 0.5rem 1rem;
      border: 2px solid #d4b97f;
      border-radius: 4px;
      z-index: 10;
      box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
    }
  
    /* Popup inherits parchment tone */
    .popup {
      position: fixed;
      top: calc(50% + 3.5rem);
      right: 2rem;
      background: rgba(250, 243, 224, 0.95);
      padding: 1rem;
      border: 1px solid #d4b97f;
      border-radius: 4px;
      text-align: center;
      box-shadow: 2px 2px 8px rgba(0,0,0,0.15);
      z-index: 9;
      line-height: 1.4;
    }
    .popup p {
      margin: 0.5rem 0;
      font-style: italic;
    }
    .popup img {
      max-width: 150px;
      margin-top: 0.5rem;
      cursor: pointer;
      border-radius: 2px;
      border: 1px solid #d4b97f;
      box-shadow: 1px 1px 4px rgba(0,0,0,0.1);
    }
  
    /* Each step snaps into view */
    .step {
      scroll-snap-align: start;
      scroll-snap-stop: always;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.3;
      transition: opacity 0.5s ease;
      padding: 2rem 0;
    }
    .step.active {
      opacity: 1;
    }
    .step.active {
      opacity: 1;
    }
  
    /* Centered description with decorative left border */
    .description {
      max-width: 600px;
      font-size: 1.2rem;
      text-align: center;
      line-height: 1.6;
      padding-left: 1rem;
      border-left: 4px solid #d4b97f;
      background: rgba(250, 243, 224, 0.8);
      box-shadow: 1px 1px 4px rgba(0,0,0,0.05);
    }
  </style>
  
  <div class="container">
    <div class="year-display">{years[currentIndex]}</div>
  
    {#if currentIndex === years.length - 1}
      <div class="popup">
        <p>Explore who lives and owns in Middlesex County today:</p>
        <a href="/homeownership">
          <img src={mapPreview} alt="Middlesex County Homeownership Map" />
        </a>
        <p><small>Click the preview continue your journey.</small></p>
      </div>
    {/if}
  
    {#each years as year, i}
      <section use:collect={i} class="step" class:active={i === currentIndex}>
        <div class="description">
          <h2>{year}</h2>
          <p>{descriptions[year]}</p>
        </div>
      </section>
    {/each}
  </div>
  