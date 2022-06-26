import { D3Callback, SVG } from "../../models/graph";
import { getColor } from "./color";

class Layer 
{
    public svg: SVG;
    public label: string;
    public id: string;
    public class: string;
    public color: string;

    constructor(svg: SVG, label: string, name: string, paletteIndex: number, n: number) 
    {
        this.svg = svg;
        this.label = label;
        this.id = `${name}-${this.label}`
        this.class = `svg-${name}`
        this.color = getColor(paletteIndex, n)
    }

    public get = () => this.svg.select('#' + this.id)
    public getAll = () => this.svg.selectAll('.' + this.class) 

    // add() {}
    
    public rem()
    {
        this.get().remove()
    }

    public onMouseOver( callback: D3Callback ) 
    {
        this.get().on('mouseover', callback )
        return this;
    }

    public onMouseOut( callback: D3Callback ) 
    {
        this.get().on('mouseout', callback )
        return this;
    }
}


export default Layer;