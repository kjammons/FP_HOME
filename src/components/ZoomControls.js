import * as d3 from 'd3';

export function zoomSetup(svg) {
  const zoom = d3.zoom()
    .scaleExtent([1, 10])
    .on('zoom', (event) => {
      svg.selectAll('path').attr('transform', event.transform);
    });

  svg.call(zoom);
}
