import { EnterElement, Selection } from "d3";
import { Dispatch, SetStateAction } from "react";

import { Axis, DotHover } from "../../models/graph";
import Tooltip from "./tooltip";

type EnterSVG = Selection<EnterElement, [number, number, number], SVGGElement, unknown>

class Dot {

    static add(svg: EnterSVG, [x, y]: [Axis, Axis], color: string, label: string, setDotHover: Dispatch<SetStateAction<DotHover | undefined>>) 
    {
        svg
            .append("circle")
            .attr("cx", (d: any) => x(d[0]) )
            .attr("cy", (d: any) => y(d[1]) )
            .attr("r", 4)
            .style('opacity', 0)
            .style('fill', color)
            .on('mouseover', (e: any, d: any) => Dot.mouseOver(e, d, label, setDotHover))
            .on('mouseout', (e: any, d: any) => Dot.mouseOut(e, d, setDotHover))


        return this;
    }

    static mouseOver(e: any, d: any, label: string, setDotHover: Dispatch<SetStateAction<DotHover | undefined>>) {
        setDotHover({label, x: d[0]})
        Tooltip.mouseOver(e, d)
    }

    static mouseOut(e: any, d: any, setDotHoverIndex: Dispatch<SetStateAction<DotHover | undefined>>) {
        setDotHoverIndex(undefined)
        Tooltip.mouseOut(e, d)
    }
}

export default Dot;
