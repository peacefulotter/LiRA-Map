

import React, { FC, useCallback, useEffect, useMemo, useRef } from "react";

import { addLine, remLine } from "../../assets/graph/line";
import useAxis, { getXAxis, getYAxis } from "../../assets/graph/useAxis";

import { useGraph } from "../../context/GraphContext";

import useD3 from "../../hooks/useD3";
import useSize from "../../hooks/useSize";
import { Palette } from "../../models/graph";

import { JSONProps, PointData } from "../../models/path";
import useGradient from "../../assets/graph/useGradient";

let i = 0;

interface Props {
    labelX: string;
    labelY: string;
    palette?: Palette
}

const margin = {top: 20, right: 20, bottom: 50, left: 60};

const Graph: FC<Props> = ( { labelX, labelY, palette } ) => {

    const { setAddGraph, setRemGraph } = useGraph()

    const svgRef = useRef(null)
    const wrapperRef = useRef(null)

    const svg = useD3(svgRef, margin)
    const [width, height] = useSize(wrapperRef)

    const _width = width - margin.left - margin.right;
    const _height = height - margin.top - margin.bottom - 50;
    
    const [minX, maxX, minY, maxY] = [0, 10, 0, 10] // useChartSize(datas)
    const xAxis = useMemo( () => getXAxis(maxX, _width),  [maxX, _width] )
    const yAxis = useMemo( () => getYAxis(maxY, _height), [maxY, _height] );
    useAxis(svg, labelX, labelY, maxX, maxY, _width, _height)
    useGradient(svg, yAxis, minY, maxY, palette)

    console.log('GRAPH reset', svg, xAxis, yAxis);

    // (svg: any, [xAxis, yAxis]: [Axis | undefined, Axis | undefined] ) => 
        
    const addPath = (pathProps: JSONProps, x: (p: PointData) => number) => {

        console.log(xAxis, yAxis);
        
        if ( svg === undefined )
            return console.log('ERROR, TRYING TO ADD GRAPH DATA WHILE SVG or AXIS = undefined');

        const label = pathProps.properties.name
        const { path, minValue, maxValue, minTime, maxTime } = pathProps.dataPath
        const graphData: [number, number][] = path.map((p: PointData) => [x(p), p.value || 0] )

        addLine(svg, graphData, [xAxis, yAxis], label, i++)
    }

    const remPath = (pathProps: JSONProps) => {
        if ( svg === undefined )
            return console.log('ERROR, TRYING TO REMOVE GRAPH DATA WHILE SVG = undefined');

        i--
        remLine(svg, pathProps.properties.name )
    }

    const memAddPath = useCallback( () => addPath, [svg, xAxis, yAxis] );
    const memRemPath = useCallback( () => remPath, [svg, xAxis, yAxis] );

    useEffect( () => {
        console.log('Setting graph functions', xAxis, yAxis);
        setAddGraph(memAddPath);
        setRemGraph(memRemPath);
        // setAddGraph(() => addPath)
        // setRemGraph(() => remPath)
    }, [svg, xAxis, yAxis])
    
    return (
        <div className='graph-wrapper' style={{width: '100%', height: '100%'}} ref={wrapperRef}>
            <svg 
                ref={svgRef}
                style={{
                    width: `${width}px`, 
                    height: `${height}px`,
                }}  
            />
        </div>
    )
}

export default Graph