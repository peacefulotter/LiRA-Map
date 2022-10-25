import { getColor } from './color';
import Dots from './dots';
import Path from './path';
import Tooltip from './tooltip';
import { Path as PathData } from '../../models/path';

import {
  Axis,
  DotHover,
  DotsOptions,
  GraphData,
  PathOptions,
  SVG,
} from './types';

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
    addMarker: (selected: number, markerPos: [number, number]) => void,
  ) {
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
      for (let i = 1; i < data.length; i++) {
        if (clickedTime <= data[i][0]) {
          const closestIndex =
            data[i - 1][0] > data[i][0] - clickedTime ? i : i - 1;
          const closestPoint = pathData[closestIndex];
          addMarker(closestIndex, [closestPoint.lat, closestPoint.lng]);
          break;
        }
      }
    });

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
