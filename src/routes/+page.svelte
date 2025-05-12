<script>
  import { base } from '$app/paths';
  import {page } from "$app/stores";
  import { onMount } from 'svelte';


let pages=[
  {url: '',               title: 'You\u00A0are here!', position:{x:200, y:250, width:60, height:30}},
  { url: 'covenants',      title: 'What\u00A0are Restrictive Covenants?', position:{x:340, y:260, width:180, height:30}},
  { url: 'timeline',       title:'Tracking Homeownership Over\u00A0Time' , position:{x:130, y:460, width:190, height:30}},
  { url: 'white_homeownership', title: 'Mapping Contemporary Homeownership', position:{x:550, y:470, width:200, height:30} },
  { url: 'reading_list',   title: 'Reading List', position:{x:740, y:240, width:120, height:30}},
  { url: 'https://dusp.mit.edu/projects/massachusetts-covenants-project#:~:text=This%20research%20project%20is%20systematically,the%20United%20States%3A%20restrictive%20covenants.',
        title: 'Get Involved', position:{x:850, y:520, width:100, height:30} },
  {url: 'start_here',               title: 'START\nHERE', position:{x:500, y:360, width:150, height:50, rotate:90}, shape:'circle'},
]

let boxes = [];

  onMount(() => {
    boxes = pages.map((p, i) => {
      const el = document.getElementById(`label-${i}`);
      if (el) {
        const bbox = el.getBBox();
        return {
          x: bbox.x - 10,
          y: bbox.y - 5,
          width: bbox.width + 20,
          height: bbox.height + 10
        };
      } else {
        return { x: 0, y: 0, width: 100, height: 30 }; // fallback
      }
    });
  });
</script>

<div class="wrapper">
  <svg viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <!-- Add the background image inside SVG -->
  <image
  href={base + '/images/basemaphomepage.jpeg'}
  x="0"
  y="0"
  width="1000"
  height="800"
  preserveAspectRatio="xMidYMid meet"
/>
{#each pages as p, i}
<a href={p.url} style="text-decoration: none">
  {#if p.shape === 'circle'}
    <circle
      cx={p.position.x}
      cy={p.position.y}
      r={50}
      fill="#A91B0D"
      fill-opacity="0.8"
      stroke="white"
      stroke-width="3"
    />
    <text
      x={p.position.x}
      y={p.position.y}
      fill="white"
      font-size="18"
      font-weight="bold"
      text-anchor="middle"
      dominant-baseline="middle"
      font-family="Courier"
    >
      {#each p.title.split('\n') as line, j}
        <tspan x={p.position.x} dy={j === 0 ? '-0.6em' : '1.2em'}>{line}</tspan>
      {/each}
    </text>
  {:else}
    {#if boxes[i]}
      <rect
        x={boxes[i].x}
        y={boxes[i].y}
        width={boxes[i].width}
        height={boxes[i].height}
        fill="#A91B0D"
        stroke="white"
        stroke-width="1"
        rx="0"
      />
    {/if}

    <text
      id={`label-${i}`}
      x={p.position.x}
      y={p.position.y}
      fill="white"
      font-size="12"
      font-weight="bold"
      text-anchor="middle"
      dominant-baseline="middle"
      font-family="Courier"
    >
      {#each p.title.split(' ') as word, j}
        <tspan x={p.position.x} dy={j === 0 ? '0' : '1.2em'}>{word}</tspan>
      {/each}
    </text>
  {/if}
</a>
{/each}
</svg>
</div>


<style>
.wrapper{
  display:flex;
  height: 100vh;
  overflow: hidden;
  background-size:cover;
  background-position: center center ;
  background-repeat: no-repeat;
}

text{
  font-family:Helvetica;
}

</style>
