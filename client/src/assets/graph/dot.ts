import { EnterElement, Selection } from "d3";

import { Axis } from "../../models/graph";
import Tooltip from "./tooltip";

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

    static mouseOver(e: any, d: any) {
        console.log(this, e, d)
        Tooltip.mouseOver(e, d)
    }

    static mouseOut(e: any, d: any) {
        console.log(this, e, d)
        Tooltip.mouseOut(e, d)
    }
}

export default Dot;
