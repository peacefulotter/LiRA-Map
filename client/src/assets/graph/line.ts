

import { Axis, GraphData, SVG } from "../../models/graph";
import { getColors } from "./color";
import Dots from "./dots";
import Path from "./path";


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
    const colors = getColors(0)
    const color = colors[i % colors.length]

    const line = new Line(svg, label)
        .add(data, axis, color)

    line.path.onMouseOver( () => {
        line.path.allMouseOver()
        line.dots.mouseOver()
        line.path.mouseOver(3)
    })

    line.path.onMouseOut( () => {
        line.path.allMouseOut()
        line.dots.mouseOut(color)
        line.path.mouseOut(color)
    })

    line.dots.onMouseOver( () => {
        line.dots.get()
            .selectAll('circle')
            .style('opacity', 1)
    })

    line.dots.onMouseOut( () => {
        line.dots.get()
            .selectAll('circle')
            .style('opacity', 0)
    })
}

export const remLine = (svg: SVG, label: string) => {
    Line.rem(svg, label)
}