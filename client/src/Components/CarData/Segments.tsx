import { FC, useState, useEffect } from "react";

import '../../css/rides.css'
import {PathProps, SegmentProps} from '../../assets/models';
import Path from "../Map/Path";


interface SegmentsProps {
    segments: SegmentProps[] 
}

const Segments: FC<SegmentsProps> = (props) => {

    const getColor = (val: number, maxval: number, minval: number): string => {

        if(val == undefined)
            return `rgb(0, 0, 0)`

        if(val > maxval)
            val = maxval;
        else if(val < minval)
            val = minval;

        val = (val - minval) * (1/(maxval-minval));

        const green: number = Math.min(val * 2, 1) * 255;
        const red: number = (val < 0.5 ? val +  0.5 : 2 - val * 2) * 255;                 
        return `rgb(${Math.round(red)}, ${Math.round(green)}, 0)`
    }


    return (
        <div>
            { props.segments.map( segment =>{

                segment.properties.color=getColor(segment.avg, 175, 145);

                return(<Path 
                    key={`Segment${Math.random()}`} 
                    path={segment.path} 
                    properties={segment.properties} 
                    />)      
                }
            )}
        </div>
  )
}

export default Segments;