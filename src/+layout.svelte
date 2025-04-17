<!-- JAVASCRIPT -->
<script>
    import { page } from "$app/stores";
        
    let pages = [
        { url: ".", title: "Home" },
        { url: "homeownership_map", title: "Homeownership Map" },
    ];
    
    let root = globalThis?.document?.documentElement;
    
    let localStorage = globalThis.localStorage ?? {};
    
    </script>
     

    <nav>
        {#each pages as p}
        <a
        href={p.url}
        class:current={$page.route.id === p.url}
        target={p.url.startsWith("http") ? "_blank" : null}
      >
        {p.title}
      </a>
        {/each}
      </nav>
    
      <slot />

    <style>

        
        nav {
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 10px 0;
            margin-bottom: 20px;
            border-bottom: 1px solid var(--border-gray);
        }
        
        nav a {
            flex: 1;
            text-align: center;
            padding: 10px;
            text-decoration: none;
            color: inherit;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        nav a.current {
            color: #000;
            border-bottom: 0.4em solid var(--border-gray);
            padding-bottom: 0.1em;
        }
        
        nav a:hover {
            background-color: oklch(65% 50% 0 / 15%);
            border-bottom: 0.4em solid var(--color-accent);
            color: black;
        }
        
        </style>