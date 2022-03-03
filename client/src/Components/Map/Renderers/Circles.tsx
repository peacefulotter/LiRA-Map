

import { FC } from "react";
import { Circle } from 'react-leaflet'

import { PointProps, RendererProps } from "../../../assets/models";
import Points from "./Points";

const Circles: FC<RendererProps> = ( props ) => {
    return <Points {...props} PointElt={CCircle} />
}

const CCircle: FC<PointProps> = ( { pos, properties, setSelected, i } ) =>  {    
    return <Circle 
        center={[pos.lat, pos.lng]} 
        radius={properties.size ? properties.size : 4} 
        key={`Circle${Math.random()}`}
        pathOptions={{ color: properties.color, weight: 1 }}
        eventHandlers={{click: () => setSelected(i)}}/>
}

export default Circles;

