
import { useEffect, useState } from "react"
import * as d3 from 'd3'

const useD3 = (ref: React.MutableRefObject<null>, margin: any) => {

    const [svg, setSvg] = useState<d3.Selection<SVGGElement, unknown, null, undefined>>()

    useEffect( () => {
        if ( ref.current === undefined ) return;

        setSvg( 
            d3.select(ref.current)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        )

    }, [ref])
    
    return svg
}

export default useD3;