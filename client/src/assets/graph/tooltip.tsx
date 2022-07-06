

import * as d3 from "d3";

class Tooltip 
{

    getTranslation(tooltip: HTMLElement): [number, number] 
    {
        const matrix = window
            .getComputedStyle(tooltip)
            .getPropertyValue("transform")
            .replace('matrix(', '')
            .replace(')', '')
            .split(' ')
            .map( (v: string) => parseInt(v) )

        return [matrix[4], matrix[5]]
    }

    mouseOver( e: any, d: [number, number, number] ) 
    {
        const xVal = Math.round(d[0])
        const yVal = Math.round(d[1] * 100) / 100

        d3.select('#tooltip')
            .html(`
                <div>
                    <b>x:</b> ${xVal}<br/>
                </div>
                <div>
                    <b>y:</b> ${yVal}
                </div>
            `)	
            .style('opacity', 1)
    }

    mouseOut() 
    {
        d3.select('#tooltip')
            .style("opacity", 0);
    }
}

export default Tooltip