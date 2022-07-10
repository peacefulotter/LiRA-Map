

import * as d3 from "d3";
import { GraphPoint } from "./types";
import { valToTime } from "./utils";

class Tooltip 
{
    private id = "tooltip";
    private time: boolean | undefined;

    constructor(time: boolean | undefined)
    {
        this.time = time;
    }

    mouseOver( e: any, d: GraphPoint ) 
    {
        const { clientX, clientY } = e;
        const xVal = Math.round(d[0])
        const yVal = Math.round(d[1] * 100) / 100
        const elt = document.getElementById(this.id) as HTMLElement;
        
        const { width, height } = elt.getBoundingClientRect()

        const tX = Math.max(0, Math.min(clientX - width / 2, window.innerWidth - width))
        const tY = clientY - height * 1.5;

        const x = this.time ? valToTime(xVal) : xVal;

        d3.select('#' + this.id)
            .html(`
                <div>
                    <b>x:</b> ${x}<br/>
                </div>
                <div>
                    <b>y:</b> ${yVal}
                </div>
            `)
            .style('transform', `translate(${tX}px, ${tY}px)`)
            .style('z-index', 999999)	
            .style('opacity', 1)
    }

    mouseOut() 
    {
        d3.select('#' + this.id)
            .style('z-index', -9999)
            .style("opacity", 0);
    }
}

export default Tooltip