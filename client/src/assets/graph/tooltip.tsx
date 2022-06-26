

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

        const { pageX, pageY } = e;
        const xVal = Math.round(d[0])
        const yVal = Math.round(d[1] * 100) / 100

        const maxLeft = window.innerWidth - 90
        const onRightSide = pageX >= maxLeft;

        const left = pageX - (onRightSide ? 100 : 0)
        const top = pageY - 42

        const tooltip = document.getElementById('tooltip') as HTMLElement
        const { x, y } = tooltip.getBoundingClientRect()
        const [tX, tY] = this.getTranslation(tooltip)

        const fX = tX + left - x
        const fY = tY + top - y

        d3.select('#tooltip')
            .html(`<b>x</b>: ${xVal}<br/><b>y</b>: ${yVal}`)	
            .style('border-bottom-right-radius', onRightSide ? '0px' : '4px')
            .style('border-bottom-left-radius',  onRightSide ? '4px' : '0px')
            .style('transform', `translate(${fX}px, ${fY}px)`)	
            .style('opacity', 1)
    }

    mouseOut( e: any, d: [number, number, number] ) 
    {
        d3.select('#tooltip')
            .transition()		
            .duration(300)	
            .style("opacity", 0);
    }
}

export default Tooltip