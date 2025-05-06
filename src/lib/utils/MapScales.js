// src/utils/scales.js
import * as d3 from 'd3';

/**
 * Creates and returns a D3 sequential color scale for owner rate.
 * The function extracts j_OWNER_RATE from the provided features,
 * computes the minimum and maximum values, and sets those as the domain.
 *
 * @param {Array} features - Array of GeoJSON feature objects.
 * @returns {Function} A D3 scaleSequential function using d3.interpolateBlues.
 */
export function createOwnerRateScale(features) {
  const values = features
    .map(f => +f.properties.j_OWNER_RATE)
    .filter(v => !isNaN(v));

  const min = d3.min(values);
  const max = d3.max(values);

  return d3.scaleSequential(d3.interpolateRgb("#ffe0e0", "#990000")).domain([min, max]);
}
