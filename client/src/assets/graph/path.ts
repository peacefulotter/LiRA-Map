
import * as d3 from 'd3'
import { Axis, GraphData, SVG } from "../../models/graph"

type Base = d3.Selection<d3.BaseType, unknown, null, undefined>

class Path {

    class = 'graph-path';

    svg: SVG;
    label: string;
    id: string;

    constructor(svg: SVG, label: string) {
        this.svg = svg;   
        this.label = label;
        this.id = `${this.label}-path`
    }

    getPath = () => this.svg.select('#' + this.id)

    addPath( data: GraphData, [x, y]: [Axis, Axis], color: string)
    {
        this.svg.append("path")
            .attr("id", this.id)
            .attr('class', this.class)
            .datum(data)
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

    remPath()
    {
        this.getPath().remove()
    }

    onMouseOver( callback: (path: Base) => void ) 
    {
        const p = this.getPath()
        p.on('mouseover', () => callback(p))
        return this;
    }

    onMouseOut( callback: (path: Base) => void ) 
    {
        const p = this.getPath()
        p.on('mouseout', () => callback(p))
        return this;
    }

}

export default Path;