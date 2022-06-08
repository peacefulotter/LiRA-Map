import { Dispatch, SetStateAction } from "react";
import { Axis, DotHover, GraphData, SVG } from "../../models/graph"
import Dot from "./dot";
import Layer from "./layer";



class Dots extends Layer {

    constructor(svg: SVG, label: string) {
        super(svg, label, 'dots')
    }

    add(data: GraphData, [x, y]: [Axis, Axis], color: string, label: string, setDotHoverIndex: Dispatch<SetStateAction<DotHover | undefined>> ) 
    {
        const _svg = this.svg
            .append('g')
            .attr("id", this.id)
            .attr('class', this.class)
            .selectAll("dot")
            .data(data)
            .enter()
        
        Dot.add(_svg, [x, y], color, label, setDotHoverIndex)

        return this;
    }

    mouseOver() {
        return this.get()
            .selectAll('circle')
            .style('fill', "url(#line-gradient)")
            .style('z-index', 9999)
            .style('opacity', 1)
    }

    mouseOut(color: string) {
        return this.get()
            .selectAll('circle')
            .style('fill', color)
            .style('z-index', 0)
            .style('opacity', 0)
    }

    allMouseOver() {
        this.getAll()
        // apply style
    }

    allMouseOut() {
        this.getAll()
        // apply style
    }
}

export default Dots;
