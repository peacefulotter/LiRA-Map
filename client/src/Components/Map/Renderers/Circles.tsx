

import { FC } from "react";
import { Circle } from 'react-leaflet'

import { EventRenderer, PointProps } from "../../../assets/models";
import Points from "./Points";

const Circles: EventRenderer = ( props ) => {
    return <Points {...props} PointElt={CCircle} />
}

const CCircle: FC<PointProps> = ( { pos, properties, onClick, i } ) =>  {    
    return <Circle 
        center={[pos.lat, pos.lng]} 
        radius={properties.size ? properties.size : 4} 
        key={`Circle${Math.random()}`}
        pathOptions={{ color: properties.color, weight: 1 }}
        eventHandlers={onClick(i)}/>
}

export default Circles;

