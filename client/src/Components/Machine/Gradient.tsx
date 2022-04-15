import { FC, useEffect } from "react"
import { useGraph } from "../../context/GraphContext";
import { Palette, PaletteColor, SVG } from "../../models/graph"

const defaultPalette: Palette = [
    {offset: "0%",   color: "green"},
    {offset: "50%",  color: "yellow"},
    {offset: "100%", color: "red"}
]

export interface IGradient {
    palette: Palette | undefined
    marginTop: number;
}

const getGradient = (p: Palette) => 
    `linear-gradient(0deg, ${p.map((c: PaletteColor) => `${c.color} ${c.offset} `)})`

const Gradient: FC<IGradient> = ( {  palette, marginTop } ) => {

    const { svg, axis, minY, maxY } = useGraph()

    const p = palette || defaultPalette 

    useEffect( () => {

        if ( svg === undefined || axis === undefined ) return;

        svg.append("linearGradient")
            .attr("id", "line-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0)
            .attr("y1", axis[1](minY)) 
            .attr("x2", 0)
            .attr("y2", axis[1](maxY))
            .selectAll("stop")
            .data(p)
            .enter().append("stop")
            .attr("offset", (d: any) => d.offset )
            .attr("stop-color", (d: any) => d.color )


        return () => { svg.select('#' + 'line-gradient').remove() }

    }, [svg, axis, minY, maxY, palette])

    return (
        <div 
            className="graph-palette" 
            style={{background: getGradient(p), marginTop}}>
        </div>
    )
}


export default Gradient