
import { FC, useEffect } from "react"
import { addLine, remLine } from "../../assets/graph/line"
import { useGraph } from "../../context/GraphContext";
import { GraphData } from "../../models/graph"
import { JSONProps, PointData } from "../../models/path";


interface ILine {
    json: JSONProps;
    x: (p: PointData) => number
    i: number
}

const Line: FC<ILine> = ( { json, x, i } ) => {

    const { svg, axis, addMinMax, remMinMax } = useGraph()

    const label = json.properties.name

    useEffect( () => {
        
        if ( svg === undefined || axis === undefined )
            return console.log('ERROR, TRYING TO ADD GRAPH DATA WHILE SVG or AXIS = undefined');

        const { path, minValue, maxValue, minTime, maxTime } = json.dataPath
        const data: GraphData = path.map((p: PointData) => [x(p), p.value || 0] )

        console.log(minValue, maxValue);
        
        addMinMax(label, 0, 10, minValue || Number.MAX_SAFE_INTEGER, maxValue || Number.MIN_SAFE_INTEGER)

        addLine(svg, data, axis, label, i)

        return () => {
            if ( svg === undefined )
                return console.log('ERROR, TRYING TO REMOVE GRAPH DATA WHILE SVG = undefined');

            remLine(svg, label)
            remMinMax(label)
        }

    }, [svg, json, axis, label])

    return null

}

export default Line