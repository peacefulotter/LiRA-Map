import { Axis, GraphData, SVG } from "../../models/graph"
import Layer from "./layer";



class Dots extends Layer {

    public class = 'graph-dots';

    constructor(svg: SVG, label: string) {
        super(svg, label, 'dots')
    }

    add(data: GraphData, [x, y]: [Axis, Axis], color: string) 
    {
        this.svg.append('g')
            .attr("id", this.id)
            .attr('class', this.class)
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", (d: any) => x(d[0]) )
            .attr("cy", (d: any) => y(d[1]) )
            .attr("r", 0)
            .style("fill", color)
            .style('position', "relative")

        return this;
    }

    mouseOver( radius: number ) {
        return this.get()
            .attr("r", radius)
            .style('fill', "url(#line-gradient)")
            .style('z-index', 9999)
            .selectAll('circle')
            .attr("r", radius)
            .style("fill", "url(#line-gradient)")
    }

    mouseOut(color: string) {
        return this.get()
            .attr("r", 0)
            .style('fill', color)
            .style('z-index', 0)
            .selectAll('circle')
            .attr("r", 0)
            .style("fill", color)
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
