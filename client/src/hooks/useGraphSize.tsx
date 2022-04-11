
import { useEffect, useState } from "react"
import * as d3 from 'd3'

import { GraphData } from '../models/graph'


const useChartSize = ( datas: GraphData[] ): [number, number, number, number] => {

    // TODO: remove this hook and move this to a function that is recomputed whenever we add or remove data to the chart

    const [minX, setMinX] = useState<number>(0)
    const [maxX, setMaxX] = useState<number>(0)
    const [minY, setMinY] = useState<number>(0)
    const [maxY, setMaxY] = useState<number>(0)

    useEffect( () => {
        setMinX( datas.reduce( (prev, cur) => Math.min(prev, d3.min(cur as any, (d: any) => d[0] as any) as any), Number.MAX_VALUE ) )
        setMaxX( datas.reduce( (prev, cur) => Math.max(prev, d3.max(cur as any, (d: any) => d[0] as any) as any), Number.MIN_VALUE ) )
        setMinY( datas.reduce( (prev, cur) => Math.min(prev, d3.min(cur as any, (d: any) => d[1] as any) as any), Number.MAX_VALUE ) )
        setMaxY( datas.reduce( (prev, cur) => Math.max(prev, d3.max(cur as any, (d: any) => d[1] as any) as any), Number.MIN_VALUE ) )

        console.log(minX, maxX, minY, maxY);
    }, [])

    return [minX, maxX, minY, maxY]
}

export default useChartSize;