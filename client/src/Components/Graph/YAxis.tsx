
import * as d3 from 'd3'
import { useEffect } from "react";

import { addLabelY } from '../../assets/graph/label';

import { useGraph } from "../../context/GraphContext";
import { ReactAxis } from '../../models/graph';


const YAxis: ReactAxis = ( { svg, axis, width, height, label } ) => {

    const { maxY } = useGraph()

    useEffect( () => {

        if ( svg === undefined || axis === undefined ) return;

        const axisY = svg
            .append("g")
            .call(d3.axisLeft(axis[1]))
            .call(g => g.select(".domain")
                .style('stroke-width', 5)
                .style('stroke', "url(#line-gradient)")
            )

        const _label = addLabelY( svg, height, label )

        return () => {
            axisY.remove()
            _label.remove()
        }
    }, [svg, axis, width, height, maxY] ) 
    
    return null
}

export default YAxis;