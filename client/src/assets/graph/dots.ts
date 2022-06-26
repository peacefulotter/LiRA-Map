import { Axis, DotHover, GraphData, SVG } from "../../models/graph"
import Layer from "./layer";
import Tooltip from "./tooltip";

const options = {
    radius: 4,
    opacity: 0,
    hoverOpacity: 1,
}

class Dots extends Layer 
{
    tooltip: Tooltip | undefined;
    setDotHover: (d: DotHover | undefined) => void;

    constructor( svg: SVG, label: string, i: number, data: GraphData, [x, y]: [Axis, Axis], setDotHover: (d: DotHover | undefined) => void, tooltip: boolean = true ) 
    {
        super(svg, label, 'dots', 0, i)

        this.tooltip = tooltip ? new Tooltip() : undefined;
        this.setDotHover = setDotHover;

        this.svg
            .append('g')
            .attr("id", this.id)
            .attr('class', this.class)
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", (d: any) => x(d[0]) )
            .attr("cy", (d: any) => y(d[1]) )
            .attr("r", options.radius)
            .style('opacity', options.opacity)
            .style('fill', this.color)
            .on('mouseover', (e: any, d: [number, number, number]) => this.dotMouveOver(e, d) )
            .on('mouseout', (e: any, d: [number, number, number]) => this.dotMouveOut(e, d) )
    }

    dotMouveOver( event: any, d: [number, number, number] ) 
    {
        this.setDotHover( { label: this.label, x: d[0] } )
        if ( this.tooltip ) this.tooltip.mouseOver(event, d)
    }

    dotMouveOut( event: any, d: [number, number, number] )
    {
        this.setDotHover(undefined)
        if ( this.tooltip ) this.tooltip.mouseOut(event, d)
    }

    dotsMouseOver() {
        return this.get()
            .selectAll('circle')
            .style('fill', "url(#line-gradient)")
            .style('z-index', 9999)
            .style('opacity', options.hoverOpacity)
    }

    dotsMouseOut() {
        return this.get()
            .selectAll('circle')
            .style('fill', this.color)
            .style('z-index', 0)
            .style('opacity', options.opacity)
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
