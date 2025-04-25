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

      const width = 1500;
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


      const colorMap = {
  'Total': "#AEAAAA",
  'White': '#F97B72',
  'Black': '#F2B701',
  'Black or African American': '#F2B701',
  'Other Race': '#3969AC',
  "Indian, Chinese, Japanese or Other Race": '#11A579',
  'Asian and Pacific Islander': '#11A579',
  'Asian': '#11A579',
  'American Indian': '#CA73C6',
  'American Indian, Eskimo, Aleut': '#CA73C6',
  'American Indian and Alaska Native': '#CA73C6',
  "Two or more races ": '#7F3C8D',
  'Native Hawaiian and Other Pacific Islander ' : '#D05D02',
};

svg.append('g')
    .selectAll('.grid')
    .data(y.ticks(6)) // Adjust the number of gridlines
    .join('line')
      .attr('class', 'grid')
      .attr('x1', margin.left)
      .attr('x2', width - margin.right)
      .attr('y1', d => y(d))
      .attr('y2', d => y(d))
      .attr('stroke', '#ddd')
      .attr('stroke-dasharray', '2,2');

      const tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('position', 'absolute')
    .style('visibility', 'hidden')
    .style('background-color', 'rgba(0, 0, 0, 0.7)')
    .style('color', '#fff')
    .style('padding', '5px')
    .style('border-radius', '5px')
    .style('pointer-events', 'none');

      // Draw the bars using the filtered data
      svg.selectAll('rect')
        .data(filteredData)
        .join('rect')
          .attr('x', d => x(d.category))
          .attr('y', d => y(d.value))
          .attr('height', d => y(0) - y(d.value))
          .attr('width', x.bandwidth())
          .attr('fill', d =>colorMap[d.category] || '#000000')
          .on('mouseover', function(event, d) {
        tooltip.style('visibility', 'visible')
          .text(`${d.category}: ${d.value} people`);  // Customize the text content

        // Position the tooltip next to the bar
        tooltip.style('left', `${event.pageX + 5}px`)
          .style('top', `${event.pageY - 30}px`);
      })

      // On mouseout, hide the tooltip
      .on('mouseout', function() {
        tooltip.style('visibility', 'hidden');
      });
const xAxis = svg.append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x));

  // Add X axis labels with rotation if needed
  xAxis.selectAll('text')
    .style('text-anchor', 'middle')
    .style('font-size', '12px')
    .style('font-family', "Segoe UI, 'Helvetica Neue', sans-serif")
    .attr('transform', 'rotate')
    .attr('dx', '-10') // Adjust spacing for rotated text
    .attr('dy', '10');

  // Add Y axis with labels
  const yAxis = svg.append('g')
    .attr('transform', `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(y).ticks(6));

  // Add Y axis labels (optional for the Y axis)
  yAxis.selectAll('text')
    .style('font-size', '12px')
    .style('font-family', "Segoe UI, 'Helvetica Neue', sans-serif");

 // Optional: Add a label for the Y-axis (vertical)
 svg.append('text')
  .attr('x', width / 18)  // Position the label horizontally in the center of the chart
  .attr('y', margin.top-10)  // Position the label above the axis
  .style('text-anchor', 'middle')  // Center the label horizontally
  .style('font-size', '14px')  // Optional: adjust the font size
  .text('Homeownership Rate');

}

    // Watch for changes in filteredData and trigger chart redraw
    $: {
      if (filteredData.length > 0) {
        drawChart();
      }
    }
  </script>


    <!-- Container for the chart -->
<div class="chart-container">
  <h2 class="chart-title">Homeownership Rate for {year} in Middlesex County</h2>
  <svg id="homeown-chart"></svg> <!-- D3.js will render the chart here -->
</div>


<style>
  /* Chart container */
  .chart-container {
    width: 100%;
    margin: 30px auto;
    padding: 20px;
    box-sizing: border-box;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  /* Title for the chart */
  .chart-title {
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 15px;
  }

  /* SVG element to render D3 chart */
  #homeown-chart {
    width: 100%;
    height: 100%;
    max-width: 1500px; /* Limit the width of the chart */
    margin: 0 auto;
    display: block;
    background-color: #fff; /* White background for the chart */
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }


  h2{
    font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
    text-align: center;
  }
  /* Add margins and padding for better visual spacing */
  svg g {
    fill: none;
    stroke: #333;
  }

  /* Style the bars in the chart */
  rect {
    transition: fill 0.3s ease;
  }

  rect:hover {
    fill: #388E3C; /* Darker green on hover */
  }

  /* Style the axis ticks and labels */
  .domain {
    stroke: #aaa;
  }

  .tick line {
    stroke: #aaa;
  }

  .tick text {
    font-size: 12px;
    fill: #555;
  }
</style>
