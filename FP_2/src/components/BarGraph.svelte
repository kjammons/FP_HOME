<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import { selectedCity, geoDataStore } from '../stores/state.js';
  
    // Dimensions for the SVG chart.
    const width = 400, height = 200;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  
    let svgEl;
  
    // Use Svelte’s auto-subscription to stores.
    // Here we use the `$` shorthand so that whenever the store changes, currentFeature is re-calculated.
    // We use .trim() to remove any extra spaces that might prevent matching.
    $: currentFeature = $geoDataStore && $selectedCity
        ? $geoDataStore.features.find(f => f.properties.mapc_municipal.trim() === $selectedCity.trim())
        : null;
  
    // Whenever currentFeature or the SVG reference changes, redraw the chart.
    $: if (currentFeature && svgEl) {
      console.log("Drawing chart for:", currentFeature.properties.mapc_municipal, currentFeature.properties);
      drawChart();
    }
  
    function drawChart() {
      // Define the keys for the historical populations.
      const keys = ['pop1960', 'pop1970', 'pop1980', 'pop1990', 'pop2000'];
  
      // Convert each property value to a number; log for debugging.
      const values = keys.map(key => {
        const raw = currentFeature.properties[key];
        const num = +raw;
        console.log(`For ${key}: raw="${raw}", numeric=${num}`);
        return isNaN(num) ? 0 : num;
      });
  
      // Select the SVG and clear any previous content.
      const svg = d3.select(svgEl);
      svg.selectAll("*").remove();
  
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;
  
      // Create the x-scale using a band scale for the decade keys.
      const xScale = d3.scaleBand()
        .domain(keys)
        .range([0, innerWidth])
        .padding(0.1);
  
      // Create the y-scale using the maximum historical value.
      const maxVal = d3.max(values);
      const yScale = d3.scaleLinear()
        .domain([0, maxVal])
        .range([innerHeight, 0]);
  
      // Append a group element for the chart.
      const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
  
      // Append the x-axis.
      g.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScale));
  
      // Append the y-axis.
      g.append("g")
        .call(d3.axisLeft(yScale));
  
      // Draw the bars.
      g.selectAll("rect")
        .data(keys)
        .join("rect")
        .attr("x", d => xScale(d))
        .attr("y", d => {
          const num = isNaN(+currentFeature.properties[d]) ? 0 : +currentFeature.properties[d];
          return yScale(num);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", d => {
          const num = isNaN(+currentFeature.properties[d]) ? 0 : +currentFeature.properties[d];
          return innerHeight - yScale(num);
        })
        .attr("fill", "steelblue");
    }
  </script>
  
  {#if currentFeature}
    <svg bind:this={svgEl} width={width} height={height}></svg>
  {:else}
    <p>Please select a city to see its historical population bar chart.</p>
  {/if}
  