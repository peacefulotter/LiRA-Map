import React, { FC, useMemo, useRef, useState } from 'react';
import { Palette } from 'react-leaflet-hotline';
import { Bounds, Path, PointData } from '../../models/path';

import SVGWrapper from './SVGWrapper';
import Tooltip from './Tooltip';
import XAxis from './XAxis';
import YAxis from './YAxis';

import { GraphData, GraphPoint, Plot, SVG } from '../../assets/graph/types';
import useSize from '../../hooks/useSize';

import Gradient from './Gradient';
import Labels from './Labels';
import Line from './Line';
import useAxis from './Hooks/useAxis';

import '../../css/graph.css';
import Marker from './Marker';
import { useGraph } from '../../context/GraphContext';
import GraphButtons from './GraphButtons';

const getGraphData = (path: Path): GraphData => {
  const x = (p: PointData) => new Date(p.metadata.timestamp).getTime();
  return path
    .map((p) => [x(p), p.value || 0] as GraphPoint)
    .sort(([x1, y1], [x2, y2]) => (x1 < x2 ? -1 : x1 === x2 ? 0 : 1));
};

const margin = { top: 20, right: 30, bottom: 70, left: 115 };
const paddingRight = 33;
const labelX = 'Time (h:m:s)';
const absolute = true;
const time = true;

const Graph: FC = () => {
  const wrapperRef = useRef(null);

  const [width, height] = useSize(wrapperRef);
  const w = width - margin.left - margin.right;
  const h = height - margin.top - margin.bottom;

  const [zoom, setZoom] = useState<number>(1);
  const { xAxis, yAxis } = useAxis(zoom, w, h);

  const {
    markers,
    selectedMeasurementName,
    selectedTaskID,
    selectedMeasurement,
    selectedMeasurementBounds,
    paths,
  } = useGraph();

  const plot = useMemo(() => {
    if (
      !selectedMeasurementName ||
      !selectedTaskID ||
      !(selectedMeasurementName in paths) ||
      !(selectedTaskID in paths[selectedMeasurementName])
    )
      return null;

    return {
      pathData: paths[selectedMeasurementName][selectedTaskID].path,
      data: getGraphData(paths[selectedMeasurementName][selectedTaskID].path),
      bounds: paths[selectedMeasurementName][selectedTaskID].bounds,
      label: 'r-' + selectedTaskID,
    };
  }, [paths, selectedMeasurementName, selectedTaskID]);

  if (!selectedMeasurementName || !selectedTaskID) {
    return (
      <span>Select at least one trip and one measurement to display data.</span>
    );
  }

  if (
    !(selectedMeasurementName in paths) ||
    !(selectedTaskID in paths[selectedMeasurementName]) ||
    !plot
  ) {
    return (
      <span>
        This combination trip doesn&apos;t contain data for this measurement.
      </span>
    );
  }

  const labelY = selectedMeasurementName;
  const palette = selectedMeasurement?.palette;

  const csvData = [[labelX, labelY]];

  const csvDataFunction = () => {
    if (plot != undefined) {
      plot.data.forEach((data) => {
        csvData.push([data[0].toString(), data[1].toString()]);
      });
    }

    return csvData;
  };

  return (
    <>
      <Tooltip />
      <div className="graph-wrapper" ref={wrapperRef}>
        <GraphButtons
          setZoom={setZoom}
          setCSV={csvDataFunction()}
          labelY={labelY}
        />
        <SVGWrapper
          isLeft={true}
          zoom={zoom}
          margin={margin}
          w={w}
          height={height}
        >
          {(svg: SVG) => (
            <>
              <Gradient svg={svg} axis={yAxis} palette={palette} />
              <YAxis
                svg={svg}
                axis={yAxis}
                width={w}
                height={h}
                zoom={zoom}
                absolute={absolute}
              />
              <Labels
                svg={svg}
                width={w}
                height={h}
                labelX={labelX}
                labelY={labelY}
              />
            </>
          )}
        </SVGWrapper>

        <SVGWrapper
          isLeft={false}
          zoom={zoom}
          margin={margin}
          w={w + paddingRight}
          height={height}
        >
          {(svg: SVG) => (
            <>
              <Gradient svg={svg} axis={yAxis} palette={palette} />
              <XAxis
                svg={svg}
                axis={xAxis}
                width={w}
                height={h}
                zoom={zoom}
                absolute={absolute}
                time={time}
              />
              <Line
                key={'line-' + 0}
                svg={svg}
                xAxis={xAxis}
                yAxis={yAxis}
                i={0}
                time={time}
                selectedTaskID={selectedTaskID}
                selectedMeasurementName={selectedMeasurementName}
                {...plot}
                bounds={selectedMeasurementBounds}
              />
              <Marker
                key={'marker-' + 0}
                svg={svg}
                marker={markers[`${selectedTaskID}-${selectedMeasurementName}`]}
                data={plot.data}
                xAxis={xAxis}
                yAxis={yAxis}
              />
            </>
          )}
        </SVGWrapper>
      </div>
    </>
  );
};

export default Graph;
