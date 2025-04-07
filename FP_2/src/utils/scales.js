import * as d3 from 'd3';

/**
 * Returns a sequential color scale based on population.
 * @param {number} minPop - The minimum population.
 * @param {number} maxPop - The maximum population.
 */
export function getPopScale(minPop, maxPop) {
  return d3.scaleSequential(d3.interpolateBlues)
    .domain([minPop, maxPop]);
}
