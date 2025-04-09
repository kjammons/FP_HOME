// src/utils/chartScales.js
import * as d3 from 'd3';

/**
 * Creates and returns a D3 sequential color scale for the bar chart.
 * The function extracts values from the provided features using the specified keys,
 * computes the minimum and maximum values from both arrays, and sets the scale domain.
 *
 * @param {Array} features - Array of GeoJSON feature objects.
 * @param {string} leftKey - Key in properties for the left-side (Non-White) rate.
 * @param {string} rightKey - Key in properties for the right-side (White) rate.
 * @returns {Function} A D3 sequential scale function (using d3.interpolateBlues).
 */
export function createBarChartScale(features, leftKey, rightKey) {
  // Extract values for left and right sides; filter out non-numeric values
  const leftValues = features
    .map(f => +f.properties[leftKey])
    .filter(v => !isNaN(v));
  const rightValues = features
    .map(f => +f.properties[rightKey])
    .filter(v => !isNaN(v));
    
  // Combine both arrays to compute a joint domain
  const allValues = leftValues.concat(rightValues);

  const min = d3.min(allValues);
  const max = d3.max(allValues);
  
  // Create a sequential color scale with the computed domain
  return d3.scaleSequential(d3.interpolateReds).domain([min, max]);
}
