<script>
    import { page } from '$app/stores';
    import { base } from '$app/paths';
    import { navigating } from '$app/stores';

    const pages = [
      { url: '',               title: 'Home' },
      { url: 'covenants',      title: 'Covenants' },
      { url: 'timeline',       title: 'Timeline' },
      { url: 'white_homeownership', title: 'Homeownership Map' },
      { url: 'reading_list',   title: 'Reading List' },
      {
        url: 'https://dusp.mit.edu/projects/massachusetts-covenants-project#:~:text=This%20research%20project%20is%20systematically,the%20United%20States%3A%20restrictive%20covenants.',
        title: 'Get Involved'
      }
    ];

    const hrefFor = (u) =>
      u.startsWith('http') ? u : `${base}/${u}`.replace(/\/{2,}/, '/');


    const isCurrent = (u) => {
      const path = `/${u}`.replace(/\/{2,}/, '/');
      return $page.url.pathname === path;
    };
  </script>

{#if $navigating}
<div class="route-loader">
  Loading…
</div>
{/if}


{#if $page.url.pathname !== '/'}
  <nav style="background: #faf3e0; padding: 0.5rem 1rem;">
    <ul style="list-style:none; display:flex; gap:1.5rem; margin:0; padding:0">
      {#each pages as p}
        <li>
          <a
            href={hrefFor(p.url)}
            class:current={isCurrent(p.url)}
            target={p.url.startsWith('http') ? '_blank' : undefined}
            rel={p.url.startsWith('http') ? 'noopener noreferrer' : undefined}
            >{p.title}</a
          >
        </li>
      {/each}
    </ul>
  </nav>
  {/if}
  <slot />

  <style>
    a {
      text-decoration: none;
      font-family: 'Courier', monospace;
      color: black;
      padding-bottom: 0.2rem;
    }
    a.current {
      font-family: 'Courier', monospace;
      font-weight: bold;
      border-bottom: 2px solid #333;
    }

    :global(body) {
      background-color: #000;
      color: #fff;
      margin: 0;
      padding: 0;
    }
    .route-loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: rgba(0,0,0,0.7);
    color: black;
    text-align: center;
    padding: 0.5em;
    font-size: 0.9rem;
    z-index: 1000;
  }
  </style>
