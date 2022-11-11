import React, { FC, useRef, useState } from 'react';
import { Palette } from 'react-leaflet-hotline';
import { Bounds } from '../../models/path';

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
import { FiMinusCircle } from 'react-icons/fi';
import { PointData } from '../../models/path';
import { CSVLink } from 'react-csv';

interface IGraph {
  labelX: string;
  labelY: string;
  plot: Plot;
  palette?: Palette;
  bounds?: Bounds;
  absolute?: boolean;
  time?: boolean;
  selectedTaskID: number;
  selectedMeasurementName: string;
}

const margin = { top: 20, right: 30, bottom: 70, left: 115 };
const paddingRight = 33;

const Graph: FC<IGraph> = ({
  labelX,
  labelY,
  plot,
  palette,
  bounds,
  absolute,
  time,
  selectedTaskID,
  selectedMeasurementName,
}) => {
  const wrapperRef = useRef(null);
  const [width, height] = useSize(wrapperRef);

  const w = width - margin.left - margin.right;
  const h = height - margin.top - margin.bottom;

  const [zoom, setZoom] = useState<number>(1);

  const { xAxis, yAxis } = useAxis(zoom, w, h);
  const { markers } = useGraph();

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
                bounds={bounds}
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
