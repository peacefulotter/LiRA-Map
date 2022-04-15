
import { FC, useEffect } from "react"
import { addLine, remLine } from "../../assets/graph/line"
import { useGraph } from "../../context/GraphContext";
import { GraphData } from "../../models/graph"
import { JSONProps, PointData } from "../../models/path";


interface ILine {
    data: GraphData;
    minX: number, maxX: number; minY: number; maxY: number;
    label: string; i: number
}

const Line: FC<ILine> = ( { data, minX, maxX, minY, maxY, label, i } ) => {

    const { svg, axis, addMinMax, remMinMax } = useGraph()

    useEffect( () => {
        
        if ( svg === undefined || axis === undefined )
            return console.log('ERROR, TRYING TO ADD GRAPH DATA WHILE SVG or AXIS = undefined');

        addMinMax(label, minX, maxX, minY, maxY)

        addLine(svg, data, axis, label, i)

        return () => {
            if ( svg === undefined )
                return console.log('ERROR, TRYING TO REMOVE GRAPH DATA WHILE SVG = undefined');

            remLine(svg, label)
            remMinMax(label)
        }

    }, [svg, data, label, axis])

    return null

}

export default Line