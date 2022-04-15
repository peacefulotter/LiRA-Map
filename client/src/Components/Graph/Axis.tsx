
import * as d3 from 'd3'
import { FC, useEffect } from "react";

import { addLabelX, addLabelY } from '../../assets/graph/label';
import { getXAxis, getYAxis } from '../../assets/graph/axis';

import { useGraph } from "../../context/GraphContext";

interface IAxis {
    width: number;
    height: number;
    labelX: string;
    labelY: string;
}

const Axis: FC<IAxis> = ( { width, height, labelX, labelY } ) => {

    const { svg, maxX, maxY, setAxis } = useGraph()

    useEffect( () => {

        if ( svg === undefined ) return;

        const x = getXAxis(maxX, width * 2);
        const y = getYAxis(maxY, height)

        const axisX = svg
            .select('#content')
            .append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        const axisY = svg
            .append("g")
            .call(d3.axisLeft(y))
            .call(g => g.select(".domain")
                .style('stroke-width', 5)
                .style('stroke', "url(#line-gradient)")
            )

        const _labelX = addLabelX( svg, width, height, labelX )
        const _labelY = addLabelY( svg, height, labelY )

        setAxis([x, y])

        return () => {
            axisX.remove()
            axisY.remove()
            _labelX.remove()
            _labelY.remove()
        }
    }, [svg, width, height, maxX, maxY] ) 
    
    return null
}

export default Axis;