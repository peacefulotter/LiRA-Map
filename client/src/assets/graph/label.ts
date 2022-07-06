import { SVG } from "./types";


const labelOffset = 35
const padding = 20
const fontSize = 8
const offsetX_Y = 5;

export const addLabelX = ( svg: SVG, width: number, height: number, label: string ) => {
    return svg.append('text')
        .attr('x', width - label.length * 2.5)
        .attr('y', height + labelOffset + offsetX_Y)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('fill', 'white')
        .style('font-size', fontSize)
        .text(label);
}

export const addLabelY = ( svg: SVG, height: number, label: string ) => {
    return svg.append('text')
        .attr('transform', `translate(${-labelOffset - padding}, ${height / 2 + padding}) rotate(-90)`)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('fill', 'white')
        .style('font-size', fontSize)
        .text(label);
}
