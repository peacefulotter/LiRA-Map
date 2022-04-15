

import * as d3 from "d3";

class Tooltip {
    static mouseOver(e: any, d: any) {

        const { pageX, pageY } = e;
        const x = Math.round(d[0] * 10) / 10
        const y = Math.round(d[1] * 100) / 100

        console.log(x, y, d[0], d[1]);
        const maxLeft = window.innerWidth - 75
        const onRightSide = pageX >= maxLeft;

        const left = pageX - (onRightSide ? 100 : 0)
        const top = pageY - 40

        d3.select('#tooltip')
            .html(`<b>x</b>: ${x}<br/><b>y</b>: ${y}`)	
            .style('border-bottom-right-radius', onRightSide ? '0px' : '4px')
            .style('border-bottom-left-radius',  onRightSide ? '4px' : '0px')
            .transition()		
            .duration(300)
            .style("left", left + "px")		
            .style("top", top + "px")	
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