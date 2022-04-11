

const labelOffset = 35
const fontSize = 8

export const addLabelX = ( svg: d3.Selection<SVGGElement, unknown, null, undefined>, width: number, height: number, label: string ) => {
    return svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + labelOffset)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('fill', 'white')
        .style('font-size', fontSize)
        .text(label);
}

export const addLabelY = ( svg: d3.Selection<SVGGElement, unknown, null, undefined>, height: number, label: string ) => {
    return svg.append('text')
        .attr('transform', `translate(${-labelOffset}, ${height / 2}) rotate(-90)`)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('fill', 'white')
        .style('font-size', fontSize)
        .text(label);
}
