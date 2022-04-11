

import * as d3 from "d3";

import { Axis, GraphData, SVG } from "../../models/graph";
import Dots from "./dots";
import Path from "./path";

const pathId = (label: string) => `${label}-path`

const colors = ['#79d45e', '#f6e683', '#ffaf68', '#f4889a', '#a484e9', '#31bff3'];
const grey = '#aab'
const pathClass = 'graph-path'

export const addLine = ( 
    svg: SVG, 
    data: GraphData, 
    axis: [Axis, Axis],
    label: string,
    i: number 
) =>  {
    const color = colors[i]

    const dots = new Dots(svg, label)
        .addDots(data, axis, color)
    const path = new Path(svg, label)
        .addPath(data, axis, color)
        .onMouseOver( (p: any) => {
            dots.getDots()
                .attr("r", "4")
                .style('fill', "url(#line-gradient)")
                .style('z-index', "9999")
            d3.selectAll('.' + pathClass).style('opacity', 0.2)
            p
                .style("stroke-width", "3")
                .style('stroke', "url(#line-gradient)")
                .style('z-index', "9999")
                .style('opacity', '1.0')
        })
        .onMouseOut( (p: any) => {
            dots.getDots()
                .attr("r", "0")
                .style('fill', color)
                .style('z-index', "0")
            d3.selectAll('.' + pathClass).style('opacity', 1.0)
            p
                .style("stroke-width", "2")
                .style('stroke', color)
                .style('z-index', "0")
                .style('opacity', 1.0)
        })

    // path.on('mouseover', function (d, i) {
    //         dots
    //             .attr("r", "4")
    //             .style('fill', "url(#line-gradient)")
    //             .style('z-index', "9999")
    //         d3.selectAll('.' + pathClass).style('opacity', 0.2)
    //         d3.select(this)
    //             .style("stroke-width", "3")
    //             .style('stroke', "url(#line-gradient)")
    //             .style('z-index', "9999")
    //             .style('opacity', '1.0')
    //     } )
        // .on('mouseout', function (d, i) {
        //     circles
        //         .attr("r", "0")
        //         .style('fill', color)
        //         .style('z-index', "0")
        //     d3.selectAll('.' + pathClass).style('opacity', 1.0)
        //     d3.select(this)
        //         .style("stroke-width", "2")
        //         .style('stroke', color)
        //         .style('z-index', "0")
        //         .style('opacity', 1.0)
        // } )
}

export const remLine = (svg: SVG, label: string) => {
}