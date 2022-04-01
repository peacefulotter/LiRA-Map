import { FC } from "react";

import { SegmentsProps } from '../../assets/models';
import Path from "../Map/Path";

import '../../css/rides.css'


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
        return `rgb(${Math.round(green)}, ${Math.round(red)}, 0)`
    }


    return (
        <>
        { props.segments.map( segment =>{
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