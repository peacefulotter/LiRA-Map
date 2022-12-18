// @author Benjamin Lumbye s204428, Mads Westermann s174508

import { FC, useEffect } from 'react';

import { Axis, GraphData, MarkerData, SVG } from '../../assets/graph/types';
import { addMarker } from '../../assets/graph/marker';

interface IMarker {
  svg: SVG;
  marker: MarkerData | undefined;
  data: GraphData;
  xAxis: Axis | undefined;
  yAxis: Axis | undefined;
}

const Marker: FC<IMarker> = ({ svg, marker, data, xAxis, yAxis }) => {
  useEffect(() => {
    if (!marker || !xAxis || !yAxis) return;

    const _marker = addMarker(
      svg,
      xAxis(data[marker.index][0]),
      yAxis(data[marker.index][1]),
    );

    return () => {
      _marker.remove();
    };
  }, [svg, marker, data, xAxis, yAxis]);

  return null;
};

export default Marker;
