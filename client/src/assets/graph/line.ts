import { getColor } from './color';
import Dots from './dots';
import Path from './path';
import Tooltip from './tooltip';
import { Path as PathData, PointData } from '../../models/path';

import {
  Axis,
  DotHover,
  DotsOptions,
  GraphData,
  MarkersMap,
  PathOptions,
  SVG,
} from './types';
import { range } from 'd3';
import { isBreakOrContinueStatement } from 'typescript';
import { Dispatch, SetStateAction } from 'react';

export default class GLine {
  path: Path;
  // dots: Dots;
  hitbox: Path;

  constructor(
    svg: SVG,
    label: string,
    i: number,
    pathData: PathData,
    data: GraphData,
    xAxis: Axis,
    yAxis: Axis,
    onHover: (d: DotHover | undefined) => void,
    time: boolean | undefined,
    setMarkers: Dispatch<SetStateAction<MarkersMap>>,
  ) {
    console.log('We are in the marker');
    const color = getColor(0, i);
    const hoverColor = 'url(#line-gradient)';

    const pathOpts: PathOptions = { stroke: hoverColor };

    const dotsOpts: DotsOptions = { fill: color, radius: 6 };
    const hoverDotsOpts: DotsOptions = { fill: hoverColor };

    const hitboxOpts: PathOptions = { stroke: 'transparent', strokeWidth: 30 };
    const hoverHitboxOpts: PathOptions = {
      stroke: 'transparent',
      strokeWidth: 30,
    };

    const path = new Path(svg, label, data, [xAxis, yAxis], pathOpts, pathOpts);
    const hitbox = new Path(
      svg,
      'hitbox',
      data,
      [xAxis, yAxis],
      hitboxOpts,
      hoverHitboxOpts,
    );
    // const dots = new Dots(svg, label, data, [xAxis, yAxis], dotsOpts, hoverDotsOpts )

    const tooltip = new Tooltip(time);

    hitbox.addMouseOver(() => {
      path.mouseOver();
      // dots.mouseOver();
    });

    hitbox.addMouseOut(() => {
      path.mouseOut();
      // dots.mouseOut();
    });

    hitbox.addMouseUp((event) => {
      if (!hitbox.path.node()) return;

      const clickedPercent = Math.min(
        1,
        event.offsetX /
          (hitbox.path.node() as SVGPathElement).getBoundingClientRect().width,
      );

      const duration = data[data.length - 1][0] - data[0][0];
      const clickedTime = duration * clickedPercent + data[0][0];

      let idx: number;
      if (clickedTime < data[0][0]) {
        idx = 0;
      } else if (clickedTime > data[data.length - 1][0]) {
        idx = data.length - 1;
      } else {
        idx = binarySearch(data, clickedTime, 0, data.length - 2, 0);
      }

      const point = interpolatePoint(
        clickedTime,
        data[idx][0],
        data[idx + 1][0],
        pathData[idx],
        pathData[idx + 1],
      );
      console.log('coords found');
      // TODO: Once graphs are individual replace the key below with the actual graph data
      setMarkers(
        (markers) =>
          new Map(
            markers.set('TaskID-Meas', {
              lat: point.lat,
              lng: point.lng,
              index: idx,
            }),
          ),
      );

      console.log('data[i] =     ' + data[idx][0]);
      console.log('data[i + 1] = ' + data[idx + 1][0]);
    });

    const binarySearch = (
      data: GraphData,
      target: number,
      i: number,
      j: number,
      depth: number,
    ): number => {
      const idx = Math.floor(i + (j - i) / 2);
      if (data[idx][0] <= target && target <= data[idx + 1][0]) {
        return idx;
      }

      let iNew = i;
      let jNew = j;
      if (target < data[idx][0]) {
        jNew = idx;
      } else if (target > data[idx + 1][0]) {
        iNew = idx + 1;
      }

      if (iNew === i && jNew === j) {
        return idx + 1;
      }

      return binarySearch(data, target, iNew, jNew, depth + 1);
    };

    const interpolatePoint = (
      value: number,
      neigh1value: number,
      neigh2value: number,
      neigh1coords: PointData,
      neigh2coords: PointData,
    ) => {
      const p = (value - neigh1value) / (neigh2value - neigh1value);
      const interpolatedLat = (1 - p) * neigh1coords.lat + p * neigh2coords.lat;
      const interpolatedLng = (1 - p) * neigh1coords.lng + p * neigh2coords.lng;

      return { lat: interpolatedLat, lng: interpolatedLng };
    };

    // dots.addMouseOver( (e, d) => {
    //     path.mouseOver();
    //     dots.mouseOver();
    //     tooltip.mouseOver(e, d)
    //     onHover( { label, x: d[0] } )
    // } )

    // dots.addMouseOut( (e, d) => {
    //     path.mouseOut();
    //     dots.mouseOut();
    //     tooltip.mouseOut()
    //     onHover( undefined )
    // } )

    this.path = path;
    // this.dots = dots;
    this.hitbox = hitbox;
  }

  rem() {
    this.path.rem();
    // this.dots.rem()
    this.hitbox.rem();
  }
}
