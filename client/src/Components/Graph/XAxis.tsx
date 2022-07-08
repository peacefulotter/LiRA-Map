
import * as d3 from 'd3'
import { useEffect } from "react";

import { useGraph } from "../../context/GraphContext";
import { ReactAxis } from '../../assets/graph/types';


const XAxis: ReactAxis = ( { svg, axis, width, height, zoom, absolute } ) => {

    const { minX, maxX } = useGraph()

    useEffect( () => {
        if ( svg === undefined || axis === undefined ) return;

        const d3Axis = d3
            .axisBottom(axis[0])
            .tickFormat((d: d3.NumberValue, i: number) => {
                const val = absolute ? (d as number) - minX : minX
                const date = new Date(val);
                const h = date.getHours() - 1;
                const m = date.getMinutes();
                const s = date.getSeconds();
                return `${h}:${m}:${s}`
            } )
            .ticks(10 * zoom)
        
        const axisX = svg
            .append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3Axis);

        return () => {
            axisX.remove()
        }
    }, [svg, axis, width, height, minX, maxX, zoom] ) 
    
    return null
}

export default XAxis;