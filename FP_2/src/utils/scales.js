import * as d3 from 'd3';

export function colorScale(variable) {
  return d3.scaleQuantize()
    .domain([0, 100])
    .range(d3.schemeBlues[5]);
}

export function getProjection(region, width, height) {
  let projection = d3.geoMercator().fitSize([width, height], region === "Middlesex" ? fullGeoJson : zoomedGeoJson);
  return projection;
}
