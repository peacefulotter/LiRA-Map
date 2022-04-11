

import * as d3 from "d3";

import { Axis, GraphData } from "../../models/graph";

const dotsId = (label: string) => `${label}-dots`
const pathId = (label: string) => `${label}-path`

const colors = ['#79d45e', '#f6e683', '#ffaf68', '#f4889a', '#a484e9', '#31bff3'];

export const addLine = ( 
    svg: d3.Selection<SVGGElement, unknown, null, undefined>, 
    data: GraphData, 
    [x, y]: [Axis, Axis],
    label: string,
    i: number 
) =>  {
    const color = colors[i]

    let circles = svg.append('g')
        .attr("id", dotsId(label))
        .selectAll("dot")
        .data(data as any)
        .enter()
        .append("circle")
        .attr("cx", (d: any) => x(d[0]) )
        .attr("cy", (d: any) => y(d[1]) )
        .attr("r", 0)
        // .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .style("fill", color)


    svg.append("path")
        .attr("id", pathId(label))
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .attr("d", d3.line()
            .x( (d: any) =>  x(d[0]) as any )
            .y( (d: any) => y(d[1]) as any )
        )
        .on('mouseover', function (d, i) {
            circles.transition().duration(50)
                .attr("r", "4")
                .style('fill', "url(#line-gradient)")
            d3.select(this).transition().duration(50)
                .style("stroke-width", "3")
                .style('stroke', "url(#line-gradient)")
        } )
        .on('mouseout', function (d, i) {
            circles.transition().duration(50)
                .attr("r", "0")
                .style('fill', color)
            d3.select(this).transition().duration(50)
                .style("stroke-width", "2")
                .style('stroke', color)
        } )
}

export const remLine = (svg: d3.Selection<SVGGElement, unknown, null, undefined>, label: string) => {
    svg.select('#' + pathId(label)).remove()
    svg.select('#' + dotsId(label)).remove()
}