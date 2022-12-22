import { useEffect, useState } from 'react';
import * as d3 from 'd3';

import { Axis } from '../../../assets/graph/types';
import { useGeneralGraphContext } from '../../../context/GeneralGraphContext';

const useAxis = (zoom: number, w: number, h: number) => {
  const { minX, maxX, minY, maxY } = useGeneralGraphContext();

  const [axis, setAxis] = useState<[Axis, Axis]>();

  useEffect(() => {
    const Xaxis = d3
      .scaleLinear()
      .domain([minX, maxX])
      .range([0, w * zoom]);
    const Yaxis = d3.scaleLinear().domain([minY, maxY]).range([h, 0]);
    setAxis([Xaxis, Yaxis]);
  }, [zoom, minX, maxX, minY, maxY, w, h]);

  return {
    xAxis: axis ? axis[0] : undefined,
    yAxis: axis ? axis[1] : undefined,
  };
};

export default useAxis;
