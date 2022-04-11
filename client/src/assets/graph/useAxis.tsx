
import * as d3 from "d3";
import React, { useEffect, useState } from "react";

import { addLabelX, addLabelY } from "./label";

import { Axis, SVG } from "../../models/graph";

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

const useAxis = (
    svg: SVG | undefined,
    labelX: string, labelY: string, 
    maxX: number, maxY: number,
    width: number, height: number
) => {

    useEffect( () => {

        if ( svg === undefined ) return;

        const _x = getXAxis(maxX, width);
        const _y = getYAxis(maxY, height)

        const axisX = svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(_x));

        const axisY = svg.append("g")
            .call(d3.axisLeft(_y));

        const _labelX = addLabelX( svg, width, height, labelX )
        const _labelY = addLabelY( svg, height, labelY )

        return () => {
            axisX.remove()
            axisY.remove()
            _labelX.remove()
            _labelY.remove()
        }
    }, [svg, width, height, maxX, maxY] ) 
    
    return null
}

export default useAxis;
