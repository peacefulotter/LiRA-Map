// @author Benjamin Lumbye s204428, Mads Westermann s174508

import { SVG } from './types';

const color = 'white';
const radius = 5;
const opacity = 0.6;

export const addMarker = (svg: SVG, x: number, y: number) => {
  return svg
    .append('circle')
    .attr('cx', x)
    .attr('cy', y)
    .attr('r', radius)
    .style('fill', color)
    .style('opacity', opacity);
};
