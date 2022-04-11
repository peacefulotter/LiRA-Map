import { Axis, GraphData, SVG } from "../../models/graph"



class Dots {

    class = 'graph-path';

    svg: SVG;
    label: string;
    id: string;

    constructor(svg: SVG, label: string) {
        this.svg = svg;   
        this.label = label;
        this.id = `${this.label}-dots`
    }

    getDots = () => this.svg.select('#' + this.id)

    addDots(data: GraphData, [x, y]: [Axis, Axis], color: string) 
    {
        this.svg.append('g')
            .attr("id", this.id)
            .attr('class', this.class)
            .selectAll("dot")
            .data(data as any)
            .enter()
            .append("circle")
            .attr("cx", (d: any) => x(d[0]) )
            .attr("cy", (d: any) => y(d[1]) )
            .attr("r", 0)
            // .attr("transform", "translate(" + 100 + "," + 100 + ")")
            .style("fill", color)
            .style('position', "relative")

        return this;
    }

    remDots(svg: SVG, label: string) 
    {
        svg.select('#' + this.id).remove()
    }

}

export default Dots;
