import { FC, useState } from "react";
import { Marker, Popup } from 'react-leaflet'

import '../../css/rides.css'
import { AggregatedValueInterface, SegmentInterface } from "../../models/models";
import Path from "../Map/Path";
import { PointData } from "../../models/path";
import { DataPath } from "../../models/path";
import { PathProperties } from "../../models/properties";
import { RendererName } from "../../models/renderers";

export interface SegmentProps extends SegmentInterface{
    count:number,
    type:string,
    aggregation:string,
    value:number
}


const Segment: FC<SegmentProps> = ({id, positionA, positionB, way, count, type, aggregation, value}) => {
    
    
    const getColor = (val: number, maxval: number, minval: number): string => {
        const v = Math.min(1, Math.max(0, (val - minval) / (maxval - minval))) 
        const green: number = Math.min(v * 2, 1) * 255;
        const red: number = (v < 0.5 ? v +  0.5 : 2 - v * 2) * 255;                 
        return `rgb(${Math.round(green)}, ${Math.round(red)}, 0)`
    }

    const onClick = (i: number) => (e: any) => {
    }

    const getDataPath = () => {
        const pointA: PointData = { lat: positionA[0], lng:  positionA[1] }
        const pointB: PointData = { lat: positionB[0], lng:  positionB[1] }
        return { path: [pointA, pointB], minX: 0, maxX: 10, minY: 0, maxY: 10 };
    }

    const getProperties = () => {
        return { rendererName: RendererName.line, color:getColor(value, 5, 0), width: 4 }
    }

    return(<>
        <Path 
            key={`Segment${Math.random()}`} 
            dataPath={getDataPath()} 
            properties={getProperties()}
            onClick = {onClick}
        />
    </>   )
}

export default Segment;