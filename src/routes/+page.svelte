<script>
  import { base } from '$app/paths';
  import {page } from "$app/stores";

let pages=[
  {url:"/", title:"Home", position:{x:120, y:150, width:150, height:50}}
]
</script>

<div class="wrapper">
  <svg width="100%" heigh="100%">
      {#each pages as p}
      <a href={p.url} style="text-decoration:none">
        <rect
         x={p.position.x-10}
         y={p.position.y}
         width={p.position.width+20}
         height={p.position.height}
         fill="rgba (255, 255,255, 0.9)"
         stroke="red"
         stroke-wdith="5"
         />
        <text
         x={p.position.x + p.position.width/2}
         y={p.position.y + p.position.height/2}
         fill="red"
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





<main>
  <!-- full-width responsive image -->
  <img
    src="{backgroundUrl}"
    alt="Landing illustration"
    style="display: block; width: 100%; height: auto; object-fit: cover; margin: 0 auto;"
  />

</main>

<style>

  </style>
