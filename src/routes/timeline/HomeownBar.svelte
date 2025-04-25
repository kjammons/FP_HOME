<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';

    export let year = 1920;
    export let csvPath = 'src/lib/assets/data/home_ownership_by_decade.csv';
    let data = [];

    // Load the CSV file and store it in the data variable
    onMount(async () => {
      const csv = await d3.csv(csvPath, d => ({
        year: +d.YEAR,
        category: d.Category,
        value: +d.Value
      }));

      console.log("Loaded CSV:", csv);

      // Store the loaded CSV data in the data array
      data = csv;

      // Call drawChart when data is loaded
      drawChart();
    });

    // This reactive statement filters the data based on the selected year
    $: filteredData = data.filter(d => d.year === year && d.value>0);

    // Function to draw the chart based on filtered data
    function drawChart() {
      if (filteredData.length === 0) return;  // No data for selected year

      const width = 800;
      const height = 500;
      const margin = { top: 40, right: 20, bottom: 30, left: 60 };

      const svg = d3.select('#homeown-chart')
        .attr('width', width)
        .attr('height', height);

      svg.selectAll('*').remove(); // Clear old chart

      // Set up the X scale using the filtered data
      const x = d3.scaleBand()
        .domain(filteredData.map(d => d.category)) // Using filtered data for categories
        .range([margin.left, width - margin.right])
        .padding(0.1);

      // Set up the Y scale based on the filtered data's values
      const y = d3.scaleLinear()
        .domain([0, d3.max(filteredData, d => d.value)]).nice()
        .range([height - margin.bottom, margin.top]);

      // Draw the bars using the filtered data
      svg.selectAll('rect')
        .data(filteredData)
        .join('rect')
          .attr('x', d => x(d.category))
          .attr('y', d => y(d.value))
          .attr('height', d => y(0) - y(d.value))
          .attr('width', x.bandwidth())
          .attr('fill', '#4CAF50');

      // Add X axis
      svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

      // Add Y axis
      svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(6));
    }

    // Watch for changes in filteredData and trigger chart redraw
    $: {
      if (filteredData.length > 0) {
        drawChart();
      }
    }
  </script>



  <style>
      .bar {
          background: steelblue;
          padding: 3px;
          margin: 1px;
          text-align: right;
          color: white;
      }

  </style>

    <h2>Homeownership - {year}</h2>
    <svg id="homeown-chart"></svg>
