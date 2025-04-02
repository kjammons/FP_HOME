import * as d3 from 'd3';

export async function loadGeoJSON(path) {
  return await d3.json(path);
}

export async function loadDemographicsData(path) {
  const data = await d3.csv(path);
  return data.map(d => ({ id: d.region_id, ...d }));
}
