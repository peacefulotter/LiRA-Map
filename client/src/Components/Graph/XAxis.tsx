
import * as d3 from 'd3'
import { useEffect } from "react";

import { addLabelX } from '../../assets/graph/label';

import { useGraph } from "../../context/GraphContext";
import { ReactAxis } from '../../models/graph';


const XAxis: ReactAxis = ( { svg, axis, width, height, label } ) => {

    const { maxX } = useGraph()

    useEffect( () => {

        if ( svg === undefined || axis === undefined ) return;

        const axisX = svg
            .append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(axis[0]));

        const labelW = Math.min(window.innerWidth - 130, width)

        const _label = addLabelX( svg, labelW, height, label )
        
        return () => {
            axisX.remove()
            _label.remove()
        }
    }, [svg, axis, width, height, maxX] ) 
    
    return null
}

export default XAxis;