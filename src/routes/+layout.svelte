<script>
    import { page } from "$app/stores";
        
    let pages = [
        { url: "/", title: "Home" },
        { url: "/covenants", title: "Covenants" },
        { url: "/timeline", title: "Timeline" },
        { url: "/white_homeownership", title: "Homeownership Map" },
    ];
</script>

<nav>
    <ul style="list-style: none; display: flex; gap: 20px; padding: 0;">
        {#each pages as p}
        <li>
            <a
                href={p.url}
                class:current={$page.url.pathname === p.url}
                style="text-decoration: none; color: black;"
            >
                {p.title}
            </a>
        </li>
        {/each}
    </ul>
</nav>

<slot />