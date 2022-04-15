

import { FC, useRef } from "react";

import useSize from "../../hooks/useSize";
import { Palette } from "../../models/graph";

import Gradient from "./Gradient";
import SVGWrapper from "./SVGWrapper";
import Tooltip from "./Tooltip";

import '../../css/graph.css'

interface Props {
    labelX: string;
    labelY: string;
    palette?: Palette
}

const margin = {top: 20, right: 20, bottom: 50, left: 60};

const Graph: FC<Props> = ( props ) => {

    const { children, labelX, labelY, palette } = props

    const wrapperRef = useRef(null)
    const [width, height] = useSize(wrapperRef)

    return (
        <div className='graph-wrapper' ref={wrapperRef}>
            <Tooltip />
            <Gradient palette={palette} marginTop={margin.top}/>
            <SVGWrapper margin={margin} width={width} height={height} labelX={labelX} labelY={labelY}>
                {children}
            </SVGWrapper>
        </div>
    )
}

export default Graph