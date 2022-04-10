

import * as d3 from "d3";
import { ChartData } from "../../Components/Machine/Graph";
import { Axis } from "./axis";

const addLine = ( 
    svg: d3.Selection<SVGGElement, unknown, null, undefined>, 
    data: ChartData, 
    [x, y]: [Axis, Axis],
    usePalette: boolean, i: number ) => 
{
    const colors = ['#A0D7F9', '#FBF7A3', '#F2A3B4', '#BF99CF'];
    const color = colors[i]

    let circles = svg.append('g')
        .selectAll("dot")
        .data(data as any)
        .enter()
        .append("circle")
        .attr("cx", (d: any) => x(d[0]) )
        .attr("cy", (d: any) => y(d[1]) )
        .attr("r", 2)
        // .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .style("fill", color)


    svg.append("path")
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
                .attr("r", "6")
                .style('fill', usePalette ? "url(#line-gradient)" : color)
            d3.select(this).transition().duration(50)
                .style("stroke-width", "4")
                .style('stroke', usePalette ? "url(#line-gradient)" : color)
        } )
        .on('mouseout', function (d, i) {
            circles.transition().duration(50)
                .attr("r", "2")
                .style('fill', color)
            d3.select(this).transition().duration(50)
                .style("stroke-width", "2")
                .style('stroke', color)
        } )

    

}

export default addLine