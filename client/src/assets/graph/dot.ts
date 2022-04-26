import { EnterElement, Selection } from "d3";
import { Dispatch, SetStateAction } from "react";

import { Axis } from "../../models/graph";
import Tooltip from "./tooltip";

type EnterSVG = Selection<EnterElement, [number, number, number], SVGGElement, unknown>

class Dot {

    static add(svg: EnterSVG, [x, y]: [Axis, Axis] , color: string, setDotHoverIndex: Dispatch<SetStateAction<number | undefined>>) 
    {
        svg
            .append("circle")
            .attr("cx", (d: any) => x(d[0]) )
            .attr("cy", (d: any) => y(d[1]) )
            .attr("r", 4)
            .style('opacity', 0)
            .style('fill', color)
            .on('mouseover', (e: any, d: any) => Dot.mouseOver(e, d, setDotHoverIndex))
            .on('mouseout', (e: any, d: any) => Dot.mouseOut(e, d, setDotHoverIndex))


        return this;
    }

    static mouseOver(e: any, d: any, setDotHoverIndex: Dispatch<SetStateAction<number | undefined>>) {
        console.log(d);
        setDotHoverIndex(d[2])
        Tooltip.mouseOver(e, d)
    }

    static mouseOut(e: any, d: any, setDotHoverIndex: Dispatch<SetStateAction<number | undefined>>) {
        setDotHoverIndex(undefined)
        Tooltip.mouseOut(e, d)
    }
}

export default Dot;
