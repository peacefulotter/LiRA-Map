
import * as d3 from 'd3'

import Layer from './layer';

import { Axis, D3Callback, DotHover, GraphData, PathOptions, SVG } from "./types"
import { defaultHoverPathOptions, defaultPathOptions } from './constants';
import { Selection } from 'd3';



class Path extends Layer<PathOptions>
{
    path: Selection<SVGPathElement, any, null, unknown>;

    constructor( 
        svg: SVG, label: string, data: GraphData, [x, y]: [Axis, Axis],
        options?: PathOptions, hoverOptions?: PathOptions 
    ) 
    {
        super(svg, label, 'path', defaultPathOptions, defaultHoverPathOptions, options, hoverOptions)

        this.path = svg
            .append("path")
            .attr("id", this.id)
            .attr('class', this.class)
            .datum(data as any)
            .style('position', "relative")
            .attr("fill", "none")
            .attr("stroke", this.options.stroke )
            .attr("stroke-width", this.options.strokeWidth )
            .attr("d", d3.line()
                .x( (d: any) =>  x(d[0]) as any )
                .y( (d: any) => y(d[1]) as any )
            )
    }

    addMouseOver(callback: any) {
        this.path.on('mouseover', callback);
        return this
    }

    addMouseOut(callback: any) {
        this.path.on('mouseout', callback);
        return this
    }

    mouseOver() 
    {
        return this.path
            .style("stroke-width", this.hoverOptions.strokeWidth )
            .style('stroke', this.hoverOptions.stroke )
    }

    mouseOut() {
        return this.path
            .style("stroke-width", this.options.strokeWidth )
            .style('stroke', this.options.stroke )
    }
}

export default Path;