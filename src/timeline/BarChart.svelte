<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';

    export let csvPath;
    export let title = "Bar Chart";
    export let color = "steelblue";
    export let year = 2020; // default decade
    let data = [];

    onMount(async () => {
      const csv = await d3.csv('public/data/County level data_SORTED.csv', d => ({
        category: d.category,
        value: +d.value
      }));
      data = csv.filter(d => d.year === year);
    drawChart();
    });

    function drawChart() {
      const width = 500;
      const height = 300;
      const margin = { top: 20, right: 20, bottom: 30, left: 40 };

      const svg = d3.select('#chart')
        .attr('width', width)
        .attr('height', height);

      const x = d3.scaleBand()
        .domain(data.map(d => d.category))
        .range([margin.left, width - margin.right])
        .padding(0.1);

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)]).nice()
        .range([height - margin.bottom, margin.top]);

      svg.selectAll('rect')
        .data(data)
        .join('rect')
          .attr('x', d => x(d.category))
          .attr('y', d => y(d.value))
          .attr('height', d => y(0) - y(d.value))
          .attr('width', x.bandwidth())
          .attr('fill', 'steelblue');

      svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

      svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));
    }
  </script>

  <svg id="chart"></svg>
