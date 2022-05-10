
import { FC, useEffect, useRef, useState } from "react";
import * as d3 from 'd3'

import Gradient from "./Gradient";

import { Axis, Palette, Plot, ReactAxis, SVG } from "../../models/graph";
import Line from "./Line";
import Labels from "./Labels";

interface ISVG {
    isLeft: boolean;
    zoom: number;
    margin: any,
    w: number;
    h: number;
    width: number;
    height: number;
    labelX: string;
    labelY: string;
    axis: [Axis, Axis] | undefined
    Axis: ReactAxis;
    palette: Palette | undefined;
    plots?: Plot[]
}

const SVGWrapper: FC<ISVG> = ( { isLeft, zoom, margin, w, h, width, height, labelX, labelY, axis, Axis, palette, plots } ) => {

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

    }, [ref, margin, zoom, isLeft])

    return (
        <div 
            className={'svg-container ' + (isLeft ? 'svg-left' : 'svg-right')} 
            style={{height: height + 'px'}}
        >
            <svg ref={ref} style={{width: w * zoom - 20 + (isLeft ? 150 : 0) + 'px', height: '100%'}}>
                <Gradient svg={svg} axis={axis} palette={palette} />
                <Axis svg={svg} axis={axis} width={w} height={h} />
                { isLeft ? <Labels svg={svg} width={w} height={h} labelX={labelX} labelY={labelY}/> : null }
                { plots && plots.map((p: Plot, i: number) => 
                    <Line key={'line-'+i} svg={svg} axis={axis} i={i} {...p} />) 
                }
            </svg>
        </div>
    )
}

export default SVGWrapper;