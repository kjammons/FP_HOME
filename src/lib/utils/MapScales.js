// src/utils/scales.js
import * as d3 from 'd3';

/**
 * Creates a sequential red color scale for racial share maps.
 * Higher share = deeper red.
 *
 * @param {Array} features - Array of GeoJSON feature objects.
 * @param {string} shareField - The property name (e.g., 'j_SHARE_OWNER_BLACK').
 * @returns {Function} D3 scaleSequential using d3.interpolateReds.
 */
export function createShareScale(features, shareField) {
  // Use hardcoded min and max values for the share scale
  const SHARE_MIN = 0; 
  const SHARE_MAX = 1;  

  return d3.scaleSequential()
    .domain([SHARE_MIN, SHARE_MAX])
    .interpolator(d3.interpolateReds);
}

/**
 * Creates a diverging color scale for racial rate differences from White.
 * Red = Non-white advantage, White = parity, Blue = White advantage.
 *
 * @param {Array} features - Array of GeoJSON feature objects.
 * @param {string} diffField - The property name (e.g., 'DIFF_BLACK_WHITE').
 * @returns {Function} D3 scaleDiverging using d3.interpolateRdBu.
 */
export function createDifferenceScale(features, diffField) {
  // Use hardcoded min and max values for the difference scale
  const DIFF_MIN = -1;  
  const DIFF_MAX = 1;   

  return d3.scaleDiverging()
    .domain([DIFF_MIN, 0, DIFF_MAX])
    .interpolator(d3.interpolateRdBu) // Red–White–Blue
    
    .clamp(true);
}