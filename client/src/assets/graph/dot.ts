import { EnterElement, Selection } from "d3";
import { Axis } from "../../models/graph";

type EnterSVG = Selection<EnterElement, [number, number], SVGGElement, unknown>

class Dot {

    static add(svg: EnterSVG, [x, y]: [Axis, Axis] , color: string) 
    {
        svg
            .append("circle")
            .attr("cx", (d: any) => x(d[0]) )
            .attr("cy", (d: any) => y(d[1]) )
            .attr("r", 4)
            .style('opacity', 0)
            .style('fill', color)
            .on('mouseover', Dot.mouseOver)
            .on('mouseout', Dot.mouseOut)


        return this;
    }

    static mouseOver(c: SVGCircleElement, d: any) {
        console.log(this, c, d)
        console.log('here');
    }

    static mouseOut(c: SVGCircleElement, d: any) {
        console.log(this, c, d)
        console.log('out');
    }
}

export default Dot;
