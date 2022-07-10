import { Selection } from "d3";

import { defaultDotsOptions, defaultHoverDotsOptions } from "./constants";
import { Axis, D3Callback, DotsOptions, GraphData, GraphPoint, SVG } from "./types"
import Layer from "./layer";

class Dots extends Layer<DotsOptions>
{
    circles: Selection<SVGCircleElement, GraphPoint, SVGGElement, unknown> 

    constructor( 
        svg: SVG, label: string, data: GraphData, [x, y]: [Axis, Axis], 
        options?: DotsOptions, hoverOptions?: DotsOptions, 
    ) 
    {
        super(svg, label, 'dots', defaultDotsOptions, defaultHoverDotsOptions, options, hoverOptions)

        this.circles = this.svg
            .append('g')
            .attr("id", this.id)
            .attr('class', this.class)
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", (d: any) => x(d[0]) )
            .attr("cy", (d: any) => y(d[1]) )
            .attr("r", this.options.radius)
            .style('fill', this.options.fill)
            .style('opacity', this.options.opacity)
    }

    addMouseOver(callback: D3Callback) {
        this.circles.on('mouseover', callback);
        return this
    }

    addMouseOut(callback: D3Callback) {
        this.circles.on('mouseout', callback);
        return this
    }
   
    mouseOver() {
        return this.circles
            .style('z-index', 9999)
            .style('r', this.hoverOptions.radius )
            .style('fill', this.hoverOptions.fill)
            .style('opacity', this.hoverOptions.opacity)
    }

    mouseOut() {
        return this.circles
            .style('z-index', 0)
            .style('r', this.options.radius )
            .style('fill', this.options.fill)
            .style('opacity', this.options.opacity)
    }
}

export default Dots;
