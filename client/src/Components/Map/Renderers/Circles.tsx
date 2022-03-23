

import { FC } from "react";
import { Circle } from 'react-leaflet'

import { EventRenderer, PointProps } from "../../../assets/models";
import { createCircle } from "./Circle";
import Points from "./Points";

const Circles: EventRenderer = ( props ) => {
    return <Points {...props} PointElt={CCircle} />
}

const CCircle: FC<PointProps> = ( { pos, properties, onClick, i } ) =>  {    
    return createCircle(pos.lat, pos.lng, properties, onClick(i))
}

export default Circles;

