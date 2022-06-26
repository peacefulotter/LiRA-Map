

import Dots from "./dots";
import Path from "./path";

import { Axis, DotHover, GraphData, SVG } from "../../models/graph";

export default class GLine 
{
    path: Path;
    dots: Dots;

    constructor(
        svg: SVG, 
        label: string,
        i: number,
        data: GraphData, 
        axis: [Axis, Axis],
        onHover: (d: DotHover | undefined) => void
    ) {
        const path = new Path(svg, label, i, data, axis)
        const dots = new Dots(svg, label, i, data, axis, onHover)

        const mouseOverLine = () => {
            path.allMouseOver()
            dots.dotsMouseOver()
            path.mouseOver()	
        }

        const mouseOutLine = () => {
            path.allMouseOut()
            dots.dotsMouseOut()
            path.mouseOut()
        }

        path.onMouseOver( mouseOverLine )
        path.onMouseOut( mouseOutLine )
        dots.onMouseOver( mouseOverLine )
        dots.onMouseOut( mouseOutLine )
        
        this.path = path;
        this.dots = dots;
    }

    rem() 
    {
        this.path.rem()
        this.dots.rem()
    }
}