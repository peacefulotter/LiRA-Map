import { FC, useEffect } from "react"
import { useGraph } from "../../context/GraphContext";
import { Palette, PaletteColor } from "../../models/graph"

const defaultPalette: Palette = [
    {offset: "0%",   color: "green",  stopValue: 0 },
    {offset: "50%",  color: "yellow", stopValue: 2 },
    {offset: "100%", color: "red",    stopValue: 5 }
]

export interface IGradient {
    palette: Palette | undefined
    marginTop: number;
}

const gradientId = "line-gradient";

const getOffset = (color: PaletteColor, maxY: number) => color.stopValue 
    ? (color.stopValue / maxY) * 100 + '%'
    : color.offset

const getGradient = (p: Palette, maxY: number) => 
    `linear-gradient(0deg, ${p.map((c: PaletteColor) => `${c.color} ${getOffset(c, maxY)} `)})`

const Gradient: FC<IGradient> = ( { palette, marginTop } ) => {

    const { svg, axis, minY, maxY } = useGraph()

    const p = palette || defaultPalette

    useEffect( () => {

        if ( svg === undefined || axis === undefined ) return;

        svg.append("linearGradient")
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


        return () => { svg.select('#' + gradientId).remove() }

    }, [svg, axis, minY, maxY, p])

    return (
        <div 
            className="graph-palette" 
            style={{background: getGradient(p, maxY), marginTop}}>
        </div>
    )
}


export default Gradient