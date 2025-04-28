<script>
    import OverlayMap from '../lib/components/OverlayMap.svelte';
    import { page } from "$app/stores";

    let pages = [
        { url: "/", title: "Home", position: { x: 120, y: 150, width: 150, height: 50 } },
        { url: "/covenants", title: "Covenants", position: { x: 350, y: 170, width: 150, height: 50 } },
        { url: "/timeline", title: "Timeline", position: { x: 350, y: 500, width: 150, height: 50 } },
        { url: "/white_homeownership", title: "Homeownership Map", position: { x: 700, y: 550, width: 150, height: 50 } },
        { url: "/reading_list", title: "Reading List" , position: { x: 650, y: 200, width: 150, height: 50 } },
        { url: "https://dusp.mit.edu/projects/massachusetts-covenants-project#:~:text=This%20research%20project%20is%20systematically,the%20United%20States%3A%20restrictive%20covenants.", title: "Get Involved", position: { x: 1100, y: 180, width: 150, height: 50 }  },
    ];
  </script>


  <div class="wrapper">
    <svg width="100%" height="100%">
        {#each pages as p}
        <a href={p.url} style="text-decoration: none;">
            <rect
                x={p.position.x}
                y={p.position.y}
                width={p.position.width}
                height={p.position.height}
                fill="rgba(255, 255, 255, 0.7)"
                stroke="black"
                stroke-width="2"
            />
            <text
                x={p.position.x + p.position.width / 2}
                y={p.position.y + p.position.height / 2}
                fill="black"
                font-size="16"
                font-weight="bold"
                text-anchor="middle"
                dominant-baseline="middle"
            >
                {p.title}
            </text>
        </a>
        {/each}
    </svg>
</div>

<style>
.wrapper {
    display: flex;
    height: 100vh;
    overflow: hidden;
    background-image: url('src/lib/assets/data/landing page home.png'); /* Path to your background image */
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
}

text{
  font-family: Courier;
}

</style>
