
import * as d3 from "d3";

export const getXAxis = (minX: number, maxX: number, width: number) => {
    console.log(minX, maxX);
    
    return d3.scaleLinear()
        .domain([minX, maxX])
        .range([ 0, width ])
}

export const getYAxis = (minY: number, maxY: number, height: number) => {
    const axis = d3.scaleLinear()
        .domain([minY, maxY])
        .range([ height, 0 ])
    
    return axis
}
