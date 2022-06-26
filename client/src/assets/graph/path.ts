
import * as d3 from 'd3'

import Layer from './layer';

import { Axis, GraphData, SVG } from "../../models/graph"

const options = {
    strokeWidth: 2,
    hoverStrokeWidth: 3
}

class Path extends Layer 
{
    constructor( svg: SVG, label: string, i: number, data: GraphData, [x, y]: [Axis, Axis] ) 
    {
        super(svg, label, 'path', 0, i)

        svg
            .append("path")
            .attr("id", this.id)
            .attr('class', this.class)
            .datum(data as any)
            .style('position', "relative")
            .attr("fill", "none")
            .attr("stroke", this.color)
            .attr("stroke-width", options.strokeWidth)
            .attr("d", d3.line()
                .x( (d: any) =>  x(d[0]) as any )
                .y( (d: any) => y(d[1]) as any )
            )
    }

    mouseOver() 
    {
        return this.get()
            .style("stroke-width", options.hoverStrokeWidth)
            .style('stroke', "url(#line-gradient)")
            .style('z-index', 9999)
            .style('opacity', 1.0)
    }

    mouseOut() {
        return this.get()
            .style("stroke-width", options.strokeWidth)
            .style('stroke', this.color)
            .style('z-index', 0)
            .style('opacity', 1.0)
    }

    allMouseOver() {
        this.getAll()
            .style('opacity', 0.2)
    }

    allMouseOut() {
        this.getAll()
            .style('opacity', 1.0)
    }
}

export default Path;