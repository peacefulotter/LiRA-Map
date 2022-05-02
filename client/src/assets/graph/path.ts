
import * as d3 from 'd3'
import { Axis, GraphData, SVG, SVGLayer } from "../../models/graph"
import Layer from './layer';


class Path extends Layer {

    constructor(svg: SVG, label: string) {
        super(svg, label, 'path')
    }

    add( data: GraphData, [x, y]: [Axis, Axis], color: string)
    {
        this.svg
            .append("path")
            .attr("id", this.id)
            .attr('class', this.class)
            .datum(data as any)
            .style('position', "relative")
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", 2)
            .attr("d", d3.line()
                .x( (d: any) =>  x(d[0]) as any )
                .y( (d: any) => y(d[1]) as any )
            )
        return this
    }

    mouseOver(strokeWidth: number) {
        return this.get()
            .style("stroke-width", strokeWidth)
            .style('stroke', "url(#line-gradient)")
            .style('z-index', 9999)
            .style('opacity', 1.0)
    }

    mouseOut(color: string) {
        return this.get()
            .style("stroke-width", "2")
            .style('stroke', color)
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