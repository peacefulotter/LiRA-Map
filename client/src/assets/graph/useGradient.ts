import { useEffect } from "react";
import { Axis, Palette, PaletteColor, SVG } from "../../models/graph";


const defaultPalette: Palette = [
    {offset: "0%",   color: "green"},
    {offset: "50%",  color: "yellow"},
    {offset: "100%", color: "red"}
]


const useGradient = ( svg: SVG | undefined, yAxis: Axis | undefined, yMin: number, yMax: number, palette?: Palette ) => {

    const p = palette || defaultPalette 

    useEffect( () => {

        if ( svg === undefined || yAxis === undefined ) return;

        svg.append("linearGradient")
            .attr("id", "line-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0)
            .attr("y1", yAxis(yMin)) 
            .attr("x2", 0)
            .attr("y2", yAxis(yMax))
            .selectAll("stop")
            .data(p)
            .enter().append("stop")
            .attr("offset", (d: any) => d.offset )
            .attr("stop-color", (d: any) => d.color )


        return () => { svg.select('#' + 'line-gradient').remove() }

    }, [svg, yAxis, yMin, yMax, palette])

    return `linear-gradient(0deg, ${p.map((c: PaletteColor) => `${c.color} ${c.offset} `)})`
}

export default useGradient;