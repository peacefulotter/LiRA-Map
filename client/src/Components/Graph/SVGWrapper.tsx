
import { FC, useEffect, useRef } from "react";
import * as d3 from 'd3'

import { useGraph } from "../../context/GraphContext";
import Axis from "./Axis";

interface ISVG {
    margin: any,
    width: number;
    height: number;
    labelX: string;
    labelY: string;
}
// lol

const SVGWrapper: FC<ISVG> = ( { children, margin, width, height, labelX, labelY } ) => {

    const ref = useRef(null)
    const { svg, setSVG } = useGraph()

    const paletteWidth = 40;
    const w = width - margin.left - margin.right - paletteWidth;
    const h = height - margin.top - margin.bottom;
    
    useEffect( () => {
        if ( ref.current === undefined ) return;

        const _svg = d3.select(ref.current)
            .append("g")
            .attr('class', 'svg-g')
            .attr('id', 'svg-g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        setSVG(_svg)

        return () => {
            console.log(_svg.selectAll('.svg-g'));
             
            _svg.select('#svg-g').remove()
        }

    }, [ref, margin])

    return (
        <svg 
            ref={ref}
            style={{
                // width: `${width}px`, 
                // height: `${height}px`,
            }}  
        >
            <Axis width={w} height={h} labelX={labelX} labelY={labelY}/>
            {children}
        </svg>
    )
}

export default SVGWrapper;