

import { FC, useEffect, useRef, useState } from "react";

import addGradient, { Palette } from "../../assets/graph/gradient";
import { addLabelX, addLabelY } from "../../assets/graph/label";
import getAxis, { Axis } from "../../assets/graph/axis";
import addLine from "../../assets/graph/line";

import useChartSize from "../../hooks/useChartSize";
import useD3 from "../../hooks/useD3";

export type ChartData =  [number, number][]

interface Props {
    width: number;
    height: number;
    usePalette?: boolean;
    palette?: Palette
}

const Graph: FC<Props> = ( { width, height, palette } ) => {

    const datas: ChartData[] = [
        [
            [0, 50],
            [1, 40],
            [2, 63], 
            [3, 52],
            [4, 59],
            [5, 79]
        ],
        [
            [0, 30],
            [1, 70],
            [2, 63],
            [3, 52],
            [4, 59],
            [5, 79]
        ],
        [
            [0, 10],
            [2, 33],
            [3, 42],
            [4, 59],
            [5, 10],
            [6, 17]
        ]
    ]

    const margin = {top: 20, right: 20, bottom: 50, left: 60};
    const _width = width - margin.left - margin.right;
    const _height = height - margin.top - margin.bottom - 50;

    const ref = useRef(null)
    const svg = useD3(ref, margin)
    const [minX, maxX, minY, maxY] = useChartSize(datas)
    const [axis, setAxis] = useState<[Axis, Axis] | undefined>()

    useEffect( () => {

        if ( svg === undefined ||  width === 0 || height === 0 ) return;

        console.log('here');

        const [xAxis, yAxis] = getAxis(svg, maxX, maxY, _width, _height)

        setAxis([xAxis, yAxis])

        addLabelX( svg, _width, _height, "X Label" )
        addLabelY( svg, _height, 'Y Label' )

        addGradient( svg, yAxis(minY), yAxis(maxY), palette )

    }, [svg, width, height])


    useEffect( () => {
        datas.forEach( (data, i) => addData(data, true, i) )
    }, [svg, axis])

    const addData = (data: ChartData, usePalette: boolean, i: number) => {
        if ( svg === undefined || axis === undefined ) return
        addLine( svg, data, axis, usePalette, i)
    }
    
    return (
      <svg 
        ref={ref}
        style={{
          width: `${width}px`, 
          height: `${height}px`,
        }}  
    />
    )
}

export default Graph