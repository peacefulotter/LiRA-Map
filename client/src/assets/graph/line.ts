

import { getColors } from "./color";
import Dots from "./dots";
import Path from "./path";

import { Axis, DotHover, GraphData, SVG } from "../../models/graph";
import { Dispatch, SetStateAction } from 'react';


class Line {

    path: Path;
    dots: Dots;

    constructor(svg: SVG, label: string) {
        this.path = new Path(svg, label)
        this.dots = new Dots(svg, label)
    }

    add(data: GraphData, axis: [Axis, Axis], color: string, label: string, setDotHover: Dispatch<SetStateAction<DotHover | undefined>> ) {
        this.path.add(data, axis, color)
        this.dots.add(data, axis, color, label, setDotHover)
        return this;
    }

    static rem(svg: SVG, label: string) {
        const line = new Line(svg, label)
        line.path.rem()
        line.dots.rem()
    }
}


export const addLine = ( 
    svg: SVG, 
    data: GraphData, 
    axis: [Axis, Axis],
    label: string,
    i: number,
    setDotHover: Dispatch<SetStateAction<DotHover | undefined>>
) =>  {
    const colors = getColors(0)
    const color = colors[i % colors.length]

    const line = new Line(svg, label)
        .add(data, axis, color, label, setDotHover)

    const mouseOverLine = () => {
        line.path.allMouseOver()
        line.dots.mouseOver()
        line.path.mouseOver(3)	
    }

    const mouseOutLine = () => {
        line.path.allMouseOut()
        line.dots.mouseOut(color)
        line.path.mouseOut(color)
    }

    line.path.onMouseOver( mouseOverLine )
    line.path.onMouseOut( mouseOutLine )
    line.dots.onMouseOver( mouseOverLine )
    line.dots.onMouseOut( mouseOutLine )
}

export const remLine = (svg: SVG, label: string) => {
    Line.rem(svg, label)
}