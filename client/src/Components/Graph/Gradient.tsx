import { FC, useEffect } from "react"
import * as d3 from 'd3'

import { useGraph } from "../../context/GraphContext";
import { Axis, Palette, PaletteColor, SVG } from "../../models/graph"

const defaultPalette: Palette = [
    {offset: "0%",   color: "green"  },
    {offset: "50%",  color: "yellow" },
    {offset: "100%", color: "red"    }
]

export interface IGradient {
    svg: SVG | undefined;
    axis: [Axis, Axis] | undefined;
    palette: Palette | undefined
}

const gradientId = "line-gradient";

const getOffset = (color: PaletteColor, maxY: number) => color.stopValue 
    ? (color.stopValue / maxY) * 100 + '%'
    : color.offset

const Gradient: FC<IGradient> = ( { svg, axis, palette} ) => {

    const { minY, maxY } = useGraph()

    const p = palette || defaultPalette

    useEffect( () => {

        if ( svg === undefined || axis === undefined ) return;

        svg
            .append("linearGradient")
            .attr("id", gradientId)
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0)
            .attr("y1", axis[1](minY)) 
            .attr("x2", 0)
            .attr("y2", axis[1](maxY))
            .selectAll("stop")
            .data(p)
            .enter().append("stop")
            .attr("offset", (d: any) => getOffset(d, maxY) )
            .attr("stop-color", (d: any) => d.color )

        return () => { 
            svg.select('#' + gradientId).remove() 
        }

    }, [svg, axis, minY, maxY, p])

    return null
}


export default Gradient