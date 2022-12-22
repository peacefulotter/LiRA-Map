/** @author Benjamin Lumbye s204428 */

import { FC, useEffect } from 'react';
import GLine from '../../assets/graph/line';
import { useGraph } from '../../context/GraphContext';
import { Path } from '../../models/path';

import {
  Axis,
  DotHover,
  GraphAxis,
  GraphData,
  MinMax,
  SVG,
} from '../../assets/graph/types';
import { Bounds } from '../../models/path';
import { useGeneralGraphContext } from '../../context/GeneralGraphContext';

interface ILine {
  svg: SVG;
  xAxis: Axis | undefined;
  yAxis: Axis | undefined;
  pathData: Path;
  data: GraphData;
  bounds?: Bounds;
  label: string;
  i: number;
  time: boolean | undefined;
  selectedTaskID: number;
  selectedMeasurementName: string;
}

const Line: FC<ILine> = ({
  svg,
  xAxis,
  yAxis,
  pathData,
  data,
  bounds,
  label,
  i,
  time,
  selectedTaskID,
  selectedMeasurementName,
}) => {
  const { addBounds, remBounds, setDotHover } = useGeneralGraphContext();
  const { useMarkers } = useGraph();

  useEffect(() => {
    if (xAxis === undefined || yAxis === undefined) return;

    const minMaxX = Object.values(data).reduce(
      ([accMin, accMax], d) =>
        [Math.min(accMin, d[0]), Math.max(accMax, d[0])] as MinMax,
      [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER],
    ) as MinMax;

    const _bounds: Required<Bounds> = Object.assign({
      minX: minMaxX[0],
      maxX: minMaxX[1],
      minY: bounds?.minY,
      maxY: bounds?.maxY,
    });

    addBounds(label, _bounds);

    const onHover = (d: DotHover | undefined) =>
      d === undefined
        ? setDotHover(undefined)
        : setDotHover({ ...d, x: d.x / _bounds.maxX });

    const line = new GLine(
      svg,
      label,
      i,
      pathData,
      data,
      xAxis,
      yAxis,
      onHover,
      time,
      useMarkers,
      selectedTaskID,
      selectedMeasurementName,
    );

    return () => {
      if (svg === undefined)
        return console.log(
          'ERROR, TRYING TO REMOVE GRAPH DATA WHILE SVG = undefined',
        );

      line.rem();
      remBounds(label);
    };
  }, [svg, xAxis, yAxis, data, label, bounds, i, setDotHover]);

  return null;
};

export default Line;
