

import * as d3 from "d3";

import { Axis, GraphData, SVG } from "../../models/graph";

const dotsId = (label: string) => `${label}-dots`
const pathId = (label: string) => `${label}-path`

const colors = ['#79d45e', '#f6e683', '#ffaf68', '#f4889a', '#a484e9', '#31bff3'];

export const addLine = ( 
    svg: SVG, 
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
        .style('position', "relative")


    svg.append("path")
        .attr("id", pathId(label))
        .datum(data)
        .style('position', "relative")
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
                .style('z-index', "9999")
            d3.select(this).transition().duration(50)
                .style("stroke-width", "3")
                .style('stroke', "url(#line-gradient)")
                .style('z-index', "9999")
        } )
        .on('mouseout', function (d, i) {
            circles.transition().duration(50)
                .attr("r", "0")
                .style('fill', color)
                .style('z-index', "0")
            d3.select(this).transition().duration(50)
                .style("stroke-width", "2")
                .style('stroke', color)
                .style('z-index', "0")
        } )
}

export const remLine = (svg: SVG, label: string) => {
    console.log(label);
    console.log(svg.select('#' + pathId(label)));
    
    svg.select('#' + pathId(label)).remove()
    svg.select('#' + dotsId(label)).remove()
}