

import * as d3 from "d3";

class Tooltip {

    static getTranslation(tooltip: HTMLElement): [number, number] {
        const matrix = window
            .getComputedStyle(tooltip)
            .getPropertyValue("transform")
            .replace('matrix(', '')
            .replace(')', '')
            .split(' ')
            .map( (v: string) => parseInt(v) )

        return [matrix[4], matrix[5]]
    }

    static mouseOver(e: any, d: any) {

        const { pageX, pageY } = e;
        const xVal = Math.round(d[0])
        const yVal = Math.round(d[1] * 100) / 100

        const maxLeft = window.innerWidth - 75
        const onRightSide = pageX >= maxLeft;

        const left = pageX - (onRightSide ? 100 : 0)
        const top = pageY - 42

        const tooltip = document.getElementById('tooltip') as HTMLElement
        const {x, y} = tooltip.getBoundingClientRect()
        const [tX, tY] = Tooltip.getTranslation(tooltip)

        d3.select('#tooltip')
            .html(`<b>x</b>: ${xVal}<br/><b>y</b>: ${yVal}`)	
            .style('border-bottom-right-radius', onRightSide ? '0px' : '4px')
            .style('border-bottom-left-radius',  onRightSide ? '4px' : '0px')
            .style('transform', `translate(${tX + left - x}px, ${tY + top - y}px)`)	
            .style('opacity', 1)
    }

    static mouseOut(e: any, d: any) {
        d3.select('#tooltip')
            .transition()		
            .duration(300)	
            .style("opacity", 0);
    }
}

export default Tooltip