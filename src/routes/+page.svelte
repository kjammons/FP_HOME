<script>
  import { base } from '$app/paths';
  import {page } from "$app/stores";

let pages=[
  {url: '',               title: 'HOME', position:{x:170, y:250, width:60, height:30}},
  { url: 'covenants',      title: 'RESTRICTIVE COVENANTS', position:{x:340, y:260, width:180, height:30}},
  { url: 'timeline',       title: 'HISTORY OF HOMEOWNERSHIP', position:{x:80, y:460, width:190, height:30}},
  { url: 'white_homeownership', title: 'CONTEMPORARY HOMEOWNERSHIP', position:{x:450, y:470, width:200, height:30} },
  { url: 'reading_list',   title: 'READING LIST', position:{x:680, y:240, width:120, height:30}},
  { url: 'https://dusp.mit.edu/projects/massachusetts-covenants-project#:~:text=This%20research%20project%20is%20systematically,the%20United%20States%3A%20restrictive%20covenants.',
        title: 'GET INVOLVED', position:{x:780, y:520, width:100, height:30} },
  {url: 'Start Here',               title: 'START\nHERE', position:{x:550, y:360, width:150, height:50, rotate:90}, shape:'circle'},
]
</script>

<div class="wrapper">
  <svg viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <!-- Add the background image inside SVG -->
  <image
  href="/images/basemap homepage.jpeg"
  x="0"
  y="0"
  width="1000"
  height="800"
  preserveAspectRatio="xMidYMid meet"
/>
      {#each pages as p}
      <a href={p.url} style="text-decoration:none">
        {#if p.shape === 'circle'}
        <circle
          cx={p.position.x}
          cy={p.position.y}
          r={50}
          fill="#b20000"
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
        >
        {#each p.title.split('\n') as line, i}
        <tspan x={p.position.x} dy={i === 0 ? '-0.6em' : '1.2em'}>
          {line}
        </tspan>
      {/each}
        </text>
      {:else}
        <rect
         x={p.position.x-10}
         y={p.position.y}
         width={(p.position.width+20)*0.93}
         height={(p.position.height)*0.9}
         fill="#B20000"
         fill-opacity="1"
         stroke="WHITE"
         stroke-width="1"
         transform={
          p.title === 'Start Here'
            ? `rotate(-5, ${p.position.x + p.position.width / 2}, ${p.position.y + p.position.height / 2})`
            : undefined
        }
         />
        <text
         x={p.position.x + p.position.width/2.2}
         y={p.position.y + p.position.height/2}
         fill="WHITE"
         font-size="12"
         font-weight="bold"
         text-anchor="middle"
         dominant-baseline="middle"
         transform={
          p.title === 'Start Here'
            ? `rotate(-5, ${p.position.x + p.position.width / 2}, ${p.position.y + p.position.height / 2})`
            : undefined
        }
         >
            {p.title}
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
  font-family:Courier;
}


</style>
