
import { FC, useEffect } from "react"

import { addLine, remLine } from "../../assets/graph/line"

import { useGraph } from "../../context/GraphContext";

import { GraphAxis, GraphData, SVG } from "../../models/graph"


interface ILine {
    svg: SVG | undefined;
    axis: GraphAxis | undefined;
    data: GraphData;
    minX: number, maxX: number; minY: number; maxY: number;
    label: string; i: number
}

const Line: FC<ILine> = ( { svg, axis, data, minX, maxX, minY, maxY, label, i } ) => {

    const { addMinMax, remMinMax, setDotHoverIndex } = useGraph()

    useEffect( () => {

        console.log(svg, axis, data, label, i);

        if ( svg === undefined || axis === undefined ) return;
        
        addMinMax(label, minX, maxX, minY, maxY)

        addLine(svg, data, axis, label, i, setDotHoverIndex)

        return () => {
            if ( svg === undefined )
                return console.log('ERROR, TRYING TO REMOVE GRAPH DATA WHILE SVG = undefined');

            remLine(svg, label)
            remMinMax(label)
        }

    }, [svg, axis, data, label])

    return null

}

export default Line