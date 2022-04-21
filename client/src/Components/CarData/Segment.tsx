import { FC, useState } from "react";
import { Marker, Popup } from 'react-leaflet'

import '../../css/rides.css'
import { SegmentProps } from "../../models/models";
import Path from "../Map/Path";
import SegmentPopup from "./SegmentPopup";


const Segment: FC<SegmentProps> = (props) => {
    
    
    const getColor = (val: number, maxval: number, minval: number): string => {
        const v = Math.min(1, Math.max(0, (val - minval) / (maxval - minval))) 
        const green: number = Math.min(v * 2, 1) * 255;
        const red: number = (v < 0.5 ? v +  0.5 : 2 - v * 2) * 255;                 
        return `rgb(${Math.round(green)}, ${Math.round(red)}, 0)`
    }

    const onClick = (i: number) => (e: any) => {
        props.function(props);
    }

    props.properties.color = getColor(props.value, 180, 140);
    return(<>
        <Path 
            key={`Segment${Math.random()}`} 
            dataPath={props.dataPath} 
            properties={props.properties}
            onClick = {onClick}
        />
    </>   )
}

export default Segment;