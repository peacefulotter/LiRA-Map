import { FC } from "react";

import Path from "../Map/Path";

import { SegmentInterface } from "../../models/models";
import { RendererName } from "../../models/renderers";
import { PointData } from "../../models/path";

import '../../css/rides.css'


export interface SegmentProps extends SegmentInterface {
    count: number,
    value: number
    onClick?: (props: SegmentProps) => void;
    direction?: number
}


const getColor = (val: number, maxval: number, minval: number): string => {
    const v = Math.min(1, Math.max(0, (val - minval) / (maxval - minval))) 
    const green: number = Math.min(v * 2, 1) * 255;
    const red: number = (v < 0.5 ? v +  0.5 : 2 - v * 2) * 255;                 
    return `rgb(${Math.round(green)}, ${Math.round(red)}, 0)`
}

const Segment: FC<SegmentProps> = ({id, positionA, positionB, way, count, value, onClick, direction}) => {

    const onClickPath = (i: number) => (e: any) => {
        console.log(direction)
        const segmentProps: SegmentProps = {id, positionA, positionB, way, count, value, direction};
        onClick !== undefined && onClick(segmentProps);
    }

    const pointA: PointData = { lat: positionA[0], lng:  positionA[1] }
    const pointB: PointData = { lat: positionB[0], lng:  positionB[1] }
    const path = [pointA, pointB];

    const properties = { 
        rendererName: RendererName.line, 
        color: getColor(value, 5, 0), 
        width: 8,
        direction: direction
    }

    return (
        <>
        <Path 
            path={path} 
            properties={properties}
            onClick={onClickPath}
        />
        </>   
    )
}

export default Segment;