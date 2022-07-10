import { useEffect, useState } from "react"
import * as d3 from 'd3'

import { Axis } from "../../../assets/graph/types"
import { useGraph } from "../../../context/GraphContext"


const useAxis = (zoom: number, w: number, h: number) => {

    const { minX, maxX, minY, maxY } = useGraph()

    const [xAxis, setXAxis] = useState<Axis>()
    const [yAxis, setYAxis] = useState<Axis>()

    useEffect( () => {
        const axis = d3.scaleLinear()
            .domain( [minX, maxX] )
            .range( [0, w * zoom] )
        console.log(axis);
        setXAxis( axis )
    }, [zoom, minX, maxX, w, setXAxis])

    useEffect( () => {
        const axis = d3.scaleLinear()
            .domain([minY, maxY])
            .range([ h, 0 ])
        console.log(axis);
        setYAxis( axis )
    }, [minY, maxY, h, setYAxis])

    console.log(minX, maxX, minY, maxY, w, h, zoom, xAxis, yAxis);

    return { xAxis, yAxis }
}

export default useAxis;