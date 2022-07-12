

import { getColor } from "./color";
import Dots from "./dots";
import Path from "./path";
import Tooltip from "./tooltip";

import { Axis, DotHover, DotsOptions, GraphData, PathOptions, SVG } from "./types";

export default class GLine 
{
    path: Path;
    // dots: Dots;
    hitbox: Path;

    constructor(
        svg: SVG, 
        label: string,
        i: number,
        data: GraphData, 
        xAxis: Axis,
        yAxis: Axis,
        onHover: (d: DotHover | undefined) => void,
        time: boolean | undefined
    ) {
        const color = getColor(0, i)
        const hoverColor = "url(#line-gradient)"

        const pathOpts: PathOptions = { stroke: color }
        const hoverPathOpts: PathOptions = { stroke: hoverColor }

        const dotsOpts: DotsOptions = { fill: color, radius: 6 }
        const hoverDotsOpts: DotsOptions = { fill: hoverColor }

        const hitboxOpts: PathOptions = { stroke: "transparent", strokeWidth: 30 }
        const hoverHitboxOpts: PathOptions = { stroke: "transparent", strokeWidth: 30 }
        
        const path = new Path(svg, label, data, [xAxis, yAxis], pathOpts, hoverPathOpts )
        const hitbox = new Path(svg, "hitbox", data, [xAxis, yAxis], hitboxOpts, hoverHitboxOpts )
        // const dots = new Dots(svg, label, data, [xAxis, yAxis], dotsOpts, hoverDotsOpts )

        const tooltip = new Tooltip(time);

        hitbox.addMouseOver( () => {
            path.mouseOver();
            // dots.mouseOver();
        } )

        hitbox.addMouseOut( () => {
            path.mouseOut();
            // dots.mouseOut();
        } )

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

    rem() 
    {
        this.path.rem()
        // this.dots.rem()
        this.hitbox.rem()
    }
}