import { FC, useState, useEffect } from "react";

import '../../css/rides.css'
import {PathProps} from '../../assets/models';
import Path from "../Map/Path";


interface SegmentsProps {
    segments: PathProps[] 
}

const Segments: FC<SegmentsProps> = (props) => {
    return (
        <div>
            { props.segments.map( p =>      
                <Path 
                key={`Segment${Math.random()}`} 
                path={p.path} 
                properties={p.properties} 
                />
            )}
        </div>
  )
}

export default Segments;