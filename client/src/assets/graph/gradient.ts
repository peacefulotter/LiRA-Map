
export interface PaletteColor {
    offset: string;
    color: string;
}

export type Palette = PaletteColor[]


const defaultPalette: Palette = [
    {offset: "0%",   color: "green"},
    {offset: "50%",  color: "yellow"},
    {offset: "100%", color: "red"}
]


const addGradient = ( svg: any, yMin: number, yMax: number, palette?: Palette,  ) => {
    svg.append("linearGradient")
        .attr("id", "line-gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0)
        .attr("y1", yMin) 
        .attr("x2", 0)
        .attr("y2", yMax)
        .selectAll("stop")
        .data(palette || defaultPalette)
        .enter().append("stop")
        .attr("offset", (d: any) => d.offset )
        .attr("stop-color", (d: any) => d.color )

}

export default addGradient;