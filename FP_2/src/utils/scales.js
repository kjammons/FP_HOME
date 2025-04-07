import * as d3 from 'd3';

export function getColorScale(variable) {
  if (variable === 'OWNER HOUSING UNITS') {
    // Example domain for counts; adjust as needed based on your CSV.
    return d3.scaleSequential(d3.interpolateBlues).domain([0, 1000]);
  } else if (variable === 'MEDIAN HOUSEHOLD_INCOME') {
    // Example domain for income (in dollars)
    return d3.scaleSequential(d3.interpolateGreens).domain([0, 200000]);
  } else if (variable === 'WHITE_POP') {
    // Example domain for population count
    return d3.scaleSequential(d3.interpolateReds).domain([0, 100000]);
  }
  // Fallback scale
  return d3.scaleSequential(d3.interpolateBlues).domain([0, 100]);
}
