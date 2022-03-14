
import { FC } from "react";
import { Rectangle } from "react-leaflet";
import { LatLngBounds } from 'leaflet'

import { EventRenderer, PointProps, Renderer } from "../../../assets/models";
import Points from "./Points";


const Rectangles: EventRenderer = ( props ) => {
    return <Points {...props} PointElt={CRectangle}/>
}

const CRectangle: FC<PointProps> = ( { pos, properties, onClick, i } ) => {

    const size: number = (properties.size || 1) / 10_000;
    const bounds: LatLngBounds = new LatLngBounds(
        [pos.lat - size / 2, pos.lng - size / 2],
        [pos.lat + size / 3, pos.lng + size / 1.2]
    );
        
    return <Rectangle
        bounds={bounds} 
        pathOptions={{ color: properties.color, weight: 4 }}
        eventHandlers={onClick(i)}/>
}

export default Rectangles
