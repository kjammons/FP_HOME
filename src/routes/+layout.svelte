<script>
    import { page } from '$app/stores';
    import { base } from '$app/paths';

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

    // If it's an absolute URL, leave it.  Otherwise prefix with base + "/"
    const hrefFor = (u) =>
      u.startsWith('http') ? u : `${base}/${u}`.replace(/\/{2,}/, '/');

    // for matching current path
    const isCurrent = (u) => {
      // Home has url="" → path should be "/"
      const path = `/${u}`.replace(/\/{2,}/, '/');
      return $page.url.pathname === path;
    };
  </script>

{#if $page.url.pathname !== '/'}
  <nav style="background: #faf3e0; padding: 0.5rem 1rem;">
    <ul style="list-style:none; display:flex; gap:1.5rem; margin:0; padding:0">
      {#each pages as p}
        <li>
          <a
            href={hrefFor(p.url)}
            class:current={isCurrent(p.url)}
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
      color: black;
      padding-bottom: 0.2rem;
    }
    a.current {
      font-weight: bold;
      border-bottom: 2px solid #333;
    }
  </style>
