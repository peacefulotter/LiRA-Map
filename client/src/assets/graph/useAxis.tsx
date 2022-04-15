
import * as d3 from "d3";

export const getXAxis = (maxX: number, width: number) => {
    return d3.scaleLinear()
        .domain([0, maxX])
        .range([ 0, width ])
}

export const getYAxis = (maxY: number, height: number) => {
    return d3.scaleLinear()
        .domain([0, maxY])
        .range([ height, 0 ]);
}
