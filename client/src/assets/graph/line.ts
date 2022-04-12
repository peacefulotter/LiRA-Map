

import * as d3 from "d3";

import { Axis, GraphData, SVG, SVGLayer } from "../../models/graph";
import Dots from "./dots";
import Path from "./path";


const colors = ['#79d45e', '#f6e683', '#ffaf68', '#f4889a', '#a484e9', '#31bff3'];
const grey = '#aab'


class Line {
    path: Path;
    dots: Dots;

    constructor(svg: SVG, label: string) {
        this.path = new Path(svg, label)
        this.dots = new Dots(svg, label)
    }

    add(data: GraphData, axis: [Axis, Axis], color: string) {
        this.path.add(data, axis, color)
        this.dots.add(data, axis, color)
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
    i: number 
) =>  {
    const color = colors[i % colors.length]

    const line = new Line(svg, label)
        .add(data, axis, color)

    line.path.onMouseOver( () => {
        line.path.allMouseOver()
        line.dots.mouseOver(4)
        line.path.mouseOver(3)
    })

    line.path.onMouseOut( () => {
        line.path.allMouseOut()
        line.dots.mouseOut(color)
        line.path.mouseOut(color)
    })
}

export const remLine = (svg: SVG, label: string) => {
    Line.rem(svg, label)
}