<script>
    import { page } from "$app/stores";

    let pages = [
        { url: "", title: "Home" },
        { url: "covenants", title: "Covenants" },
        { url: "timeline", title: "Timeline" },
        { url: "white_homeownership", title: "Homeownership Map" },
        { url: "reading_list", "title": "Reading List" },
        { url: "https://dusp.mit.edu/projects/massachusetts-covenants-project#:~:text=This%20research%20project%20is%20systematically,the%20United%20States%3A%20restrictive%20covenants.", "title": "Get Involved" },

    ];
</script>


{#if $page.url.pathname !== "/"}
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
{/if}
<div></div>


<slot />
