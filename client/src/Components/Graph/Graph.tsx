

import { FC, useEffect, useRef, useState } from "react";

import useSize from "../../hooks/useSize";
import { Axis, Palette, Plot } from "../../models/graph";

import SVGWrapper from "./SVGWrapper";
import Tooltip from "./Tooltip";

import { GraphProvider, useGraph } from "../../context/GraphContext";

import '../../css/graph.css'
import XAxis from "./XAxis";
import YAxis from "./YAxis";
import { getXAxis, getYAxis } from "../../assets/graph/axis";

interface IGraph {
    labelX: string;
    labelY: string;
    plots?: Plot[]
    palette?: Palette
}

const margin = {top: 20, right: 20, bottom: 50, left: 70};

const RGraph: FC<IGraph> = ( { labelX, labelY, plots, palette }  ) => {

    const wrapperRef = useRef(null)
    const [width, height] = useSize(wrapperRef)

    const [axis, setAxis] = useState<[Axis, Axis]>()

    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    const { maxX, maxY } = useGraph()

    const zoom = 2

    useEffect( () => {
        const x = getXAxis(maxX, w * zoom)
        const y = getYAxis(maxY, h)
        setAxis([x, y])
    }, [maxX, maxY, w, h])

    return (
        <>
        <Tooltip />
        <div className='graph-wrapper' ref={wrapperRef}>
            <SVGWrapper 
                isLeft={true} zoom={zoom}
                margin={margin} w={w} h={h} width={width} height={height} 
                label={labelY} axis={axis} Axis={YAxis} palette={palette} 
            />
            <SVGWrapper 
                isLeft={false} zoom={zoom}
                margin={margin} w={w} h={h} width={width} height={height} 
                label={labelX} axis={axis} Axis={XAxis} palette={palette} 
                plots={plots}
            />
        </div>
        </>
    )
}

const Graph: FC<IGraph> = (props) => 
    <GraphProvider>
        <RGraph {...props} />
    </GraphProvider>

export default Graph