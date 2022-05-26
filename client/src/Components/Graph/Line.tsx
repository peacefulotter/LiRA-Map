
import { FC, useEffect } from "react"

import { addLine, remLine } from "../../assets/graph/line"

import { useGraph } from "../../context/GraphContext";

import { GraphAxis, GraphData, SVG } from "../../models/graph"
import { Bounds } from "../../models/path";


interface ILine {
    svg: SVG | undefined;
    axis: GraphAxis | undefined;
    data: GraphData;
    bounds?: Bounds;
    label: string; i: number
}

const Line: FC<ILine> = ( { svg, axis, data, bounds, label, i } ) => {

    const { addMinMax, remMinMax, setDotHoverIndex } = useGraph()

    useEffect( () => {

        if ( svg === undefined || axis === undefined ) return;

        const _bounds: Bounds = {
            minX: bounds ? bounds.minX : Math.min(...data.map( d => d[0] )),
            maxX: bounds ? bounds.maxX : Math.max(...data.map( d => d[0] )),
            minY: bounds ? bounds.minY : Math.min(...data.map( d => d[1] )),
            maxY: bounds ? bounds.maxY : Math.max(...data.map( d => d[1] )),
        }

        console.log(bounds, _bounds);
        
        
        addMinMax(label, _bounds)

        addLine(svg, data, axis, label, i, setDotHoverIndex)

        return () => {
            if ( svg === undefined )
                return console.log('ERROR, TRYING TO REMOVE GRAPH DATA WHILE SVG = undefined');

            remLine(svg, label)
            remMinMax(label)
        }

    }, [svg, axis, data, label, addMinMax, remMinMax, bounds, i, setDotHoverIndex])

    return null

}

export default Line