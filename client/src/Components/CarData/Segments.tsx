import { FC } from "react";

import { SegmentsProps } from '../../models/models';
import Path from "../Map/Path";

import '../../css/rides.css'


const Segments: FC<SegmentsProps> = ( { segments } ) => {

    const getColor = (val: number, maxval: number, minval: number): string => {
        const v = Math.min(1, Math.max(0, (val - minval) / (maxval - minval))) 
        const green: number = Math.min(v * 2, 1) * 255;
        const red: number = (v < 0.5 ? v +  0.5 : 2 - v * 2) * 255;                 
        return `rgb(${Math.round(green)}, ${Math.round(red)}, 0)`
    }

    return (
        <>
        { segments.map( segment =>{
            segment.properties.color= getColor(segment.avg, 203, 126);
            return <Path 
                key={`Segment${Math.random()}`} 
                dataPath={segment.dataPath} 
                properties={segment.properties} 
            />     
        } ) }
        </>
  )
}

export default Segments;