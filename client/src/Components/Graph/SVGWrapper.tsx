
import { FC, useEffect, useRef, useState } from "react";
import * as d3 from 'd3'

import Gradient from "./Gradient";

import { Axis, Palette, Plot, ReactAxis, SVG } from "../../models/graph";
import Line from "./Line";

interface ISVG {
    isLeft: boolean;
    zoom: number;
    margin: any,
    w: number;
    h: number;
    width: number;
    height: number;
    label: string;
    axis: [Axis, Axis] | undefined
    Axis: ReactAxis;
    palette: Palette | undefined;
    plots?: Plot[]
}

const SVGWrapper: FC<ISVG> = ( { isLeft, zoom, margin, w, h, width, height, label, axis, Axis, palette, plots } ) => {

    const ref = useRef(null)
    const [svg, setSVG] = useState<SVG>()
    
    useEffect( () => {

        if ( ref.current === undefined ) return;

        const _svg = d3.select(ref.current)
            .append("g")
            .attr('class', 'svg-g')
            .attr("transform", "translate(" + (isLeft ? margin.left : 3) + "," + margin.top + ")")
            
        setSVG(_svg)

        return () => {
            _svg.selectAll('.svg-g').remove()
        }

    }, [ref, margin, zoom])

    return (
        <div 
            className={'svg-container ' + (isLeft ? 'svg-left' : 'svg-right')} 
            style={{height: height + 'px'}}
        >
            <svg ref={ref} style={{width: w * zoom + 'px', height: '100%'}}>
                <Gradient svg={svg} axis={axis} palette={palette} />
                <Axis svg={svg} axis={axis} width={w} height={h} label={label} />
                { plots && plots.map((p: Plot, i: number) => 
                    <Line key={'line-'+i} svg={svg} axis={axis} i={i} {...p} />) 
                }
            </svg>
        </div>
    )
}

export default SVGWrapper;