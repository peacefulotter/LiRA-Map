
import { useEffect, useState } from "react"
import * as d3 from 'd3'

import { SVG } from "../models/graph"

const useD3 = (ref: React.MutableRefObject<null>, margin: any) => {

    const [svg, setSvg] = useState<SVG | undefined>()

    useEffect( () => {
        if ( ref.current === undefined ) return;

        const _svg = d3.select(ref.current)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        setSvg(_svg)

    }, [ref, margin])
    
    return svg
}

export default useD3;