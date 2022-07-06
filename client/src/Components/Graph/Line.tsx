
import { FC, useEffect } from "react"

import GLine from "../../assets/graph/line"

import { useGraph } from "../../context/GraphContext";

import { DotHover, GraphAxis, GraphData, SVG } from "../../assets/graph/types"
import { Bounds } from "../../models/path";


interface ILine {
    svg: SVG | undefined;
    axis: GraphAxis | undefined;
    data: GraphData;
    bounds?: Bounds;
    label: string; i: number
}

const Line: FC<ILine> = ( { svg, axis, data, bounds, label, i } ) => {

    const { addMinMax, remMinMax, setDotHover } = useGraph()

    useEffect( () => {

        if ( svg === undefined || axis === undefined ) return;

        const _bounds: Required<Bounds> = Object.assign( {
            minX: Math.min(...data.map( d => d[0] )),
            maxX: Math.max(...data.map( d => d[0] )),
            minY: Math.min(...data.map( d => d[1] )),
            maxY: Math.max(...data.map( d => d[1] )),
        }, bounds || {} )

        addMinMax(label, _bounds)

        const onHover = (d: DotHover | undefined) => d === undefined 
            ? setDotHover( undefined )
            : setDotHover( { ...d, x: d.x / _bounds.maxX } )

        const line = new GLine(svg, label, i, data, axis, onHover)

        return () => {
            if ( svg === undefined )
                return console.log('ERROR, TRYING TO REMOVE GRAPH DATA WHILE SVG = undefined');

            line.rem()
            remMinMax(label)
        }

    }, [svg, axis, data, label, bounds, i, setDotHover])

    return null

}

export default Line