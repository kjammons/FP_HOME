<script>
    import { page } from "$app/stores";

    let pages = [
        { url: "/", title: "Home", position: { x: 50, y: 50, width: 150, height: 50 } },
        { url: "/covenants", title: "Covenants", position: { x: 220, y: 100, width: 150, height: 50 } },
        { url: "/timeline", title: "Timeline", position: { x: 400, y: 200, width: 150, height: 50 } },
        { url: "/white_homeownership", title: "Homeownership Map", position: { x: 600, y: 300, width: 150, height: 50 } },
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
                rx="10"
                ry="10"
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
    background-image: url('src/lib/assets/data/landing page.png'); /* Path to your background image */
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
}
</style>
