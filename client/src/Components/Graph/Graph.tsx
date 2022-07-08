

import { FC, useEffect, useRef, useState } from "react";
import { FiMinus, FiPlus, FiRotateCcw } from 'react-icons/fi'
import { Palette } from "react-leaflet-hotline";

import SVGWrapper from "./SVGWrapper";
import Tooltip from "./Tooltip";
import XAxis from "./XAxis";
import YAxis from "./YAxis";

import { useGraph } from "../../context/GraphContext";
import { getXAxis, getYAxis } from "../../assets/graph/axis";
import { Axis, Plot, SVG } from "../../assets/graph/types";
import useSize from "../../hooks/useSize";

import '../../css/graph.css'
import Gradient from "./Gradient";
import Labels from "./Labels";
import Line from "./Line";

interface IGraph {
    labelX: string;
    labelY: string;
    plots?: Plot[]
    palette?: Palette;
    absolute?: boolean;
}

const margin = {top: 20, right: 30, bottom: 70, left: 100};
const paddingRight = 50
const zoomGap = 0.5

const Graph: FC<IGraph> = ( { labelX, labelY, plots, palette, absolute }  ) => {

    const wrapperRef = useRef(null)
    const [width, height] = useSize(wrapperRef)

    const [axis, setAxis] = useState<[Axis, Axis]>()
    const [zoom, setZoom] = useState<number>(1)

    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    const { minX, maxX, minY, maxY } = useGraph()

    useEffect( () => {
        const x = getXAxis(minX, maxX, w * zoom)
        const y = getYAxis(minY, maxY, h)
        setAxis([x, y])
    }, [zoom, minX, maxX, minY, maxY, w, h])

    const zoomIn = () => setZoom( z => z + zoomGap )
    const zoomOut = () => setZoom( z => Math.max(1, z - zoomGap) )
    const resetZoom = () => setZoom( 1 )

    return (
        <>
        <Tooltip />
        <div className='graph-wrapper' ref={wrapperRef}>
            <div className="zoom-btns">
                <div className="btn zoom-btn" onClick={zoomIn}><FiPlus /></div>
                <div className="btn zoom-btn" onClick={zoomOut}><FiMinus /></div>
                <div className="btn zoom-btn" onClick={resetZoom}><FiRotateCcw /></div>
            </div>
            <SVGWrapper 
                isLeft={true} zoom={zoom}
                margin={margin} w={w}   height={height} 
            >
                { (svg: SVG | undefined) => <>
                     <Gradient svg={svg} axis={axis} palette={palette} />
                     <YAxis svg={svg} axis={axis} width={w} height={h} zoom={zoom} absolute={absolute}/>
                     <Labels svg={svg} width={w} height={h} labelX={labelX} labelY={labelY}/>
                </> }
            </SVGWrapper>
            <SVGWrapper 
                isLeft={false} zoom={zoom}
                margin={margin} w={w + paddingRight}  height={height} 
            >
                { (svg: SVG | undefined) => <>
                     <Gradient svg={svg} axis={axis} palette={palette} />
                     <XAxis svg={svg} axis={axis} width={w} height={h} zoom={zoom} absolute={absolute}/>
                     { plots && plots.map((p: Plot, i: number) => 
                        <Line key={'line-'+i} svg={svg} axis={axis} i={i} {...p} />) 
                    }               
                </> }
            </SVGWrapper>
        </div>
        </>
    )
}

export default Graph