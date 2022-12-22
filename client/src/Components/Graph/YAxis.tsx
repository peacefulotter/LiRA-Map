/* eslint-disable react/prop-types */
import * as d3 from 'd3';
import { useEffect } from 'react';

import { ReactAxis } from '../../assets/graph/types';
import { useGeneralGraphContext } from '../../context/GeneralGraphContext';

const YAxis: ReactAxis = ({ svg, axis, width, height, absolute }) => {
  const { maxY } = useGeneralGraphContext();

  useEffect(() => {
    if (axis === undefined) return;

    const axisY = svg
      .append('g')
      .call(d3.axisLeft(axis))
      .call((g) =>
        g
          .select('.domain')
          .style('stroke-width', 5)
          .style('stroke', 'url(#line-gradient)'),
      );
    return () => {
      axisY.remove();
    };
  }, [svg, axis, width, height, maxY]);

  return null;
};

export default YAxis;
