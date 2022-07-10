import { D3Callback, SVG } from "./types";

abstract class Layer<T>
{
    public svg: SVG;
    public label: string;
    public id: string;
    public class: string;
    public options: Required<T>;
    public hoverOptions: Required<T>;

    constructor(
        svg: SVG, label: string, name: string,
        defaultOptions: Required<T>, defaultHoverOptions: Required<T>, 
        options?: T, hoverOptions?: T 
    ) 
    {        
        this.svg = svg;
        this.label = label;
        this.id = `${name}-${this.label}`
        this.class = `svg-${name}`
        this.options = { ...defaultOptions, ...options }
        this.hoverOptions = { ...defaultHoverOptions, ...hoverOptions }
    }

    public get = () => this.svg.select('#' + this.id)
    
    public rem()
    {
        this.get().remove()
    }

    abstract addMouseOver( callback: D3Callback ): Layer<T>;
    abstract addMouseOut( callback: D3Callback ): Layer<T>;
}


export default Layer;