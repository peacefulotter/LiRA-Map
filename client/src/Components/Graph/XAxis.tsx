
import * as d3 from 'd3'
import { useEffect } from "react";

import { useGraph } from "../../context/GraphContext";
import { ReactAxis } from '../../models/graph';


const XAxis: ReactAxis = ( { svg, axis, width, height } ) => {

    const { maxX } = useGraph()

    useEffect( () => {

        if ( svg === undefined || axis === undefined ) return;

        const axisX = svg
            .append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(axis[0]));

        return () => {
            axisX.remove()
        }
    }, [svg, axis, width, height, maxX] ) 
    
    return null
}

export default XAxis;