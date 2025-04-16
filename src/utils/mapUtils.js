import * as d3 from 'd3';

export async function loadGeoJSON(path) {
  return await d3.json(path);
}
