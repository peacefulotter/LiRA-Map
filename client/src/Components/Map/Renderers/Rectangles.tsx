
import { FC } from "react";
import { Rectangle } from "react-leaflet";
import { LatLngBounds } from 'leaflet'

import Points from "./Points";
import { color, opacity, weight, width } from "../../../assets/properties";
import { EventRenderer, PointProps } from "../../../models/renderers";


const Rectangles: EventRenderer = ( props ) => {
    return <Points {...props} PointElt={CRectangle}/>
}

const CRectangle: FC<PointProps> = ( { lat, lng, pointProperties, pathProperties, onClick, i } ) => {

    const size: number = width(pointProperties, pathProperties) / 10_000;
    const bounds: LatLngBounds = new LatLngBounds(
        [lat - size / 2, lng - size / 2],
        [lat + size / 3, lng + size / 1.2]
    );
        
    return <Rectangle
        bounds={bounds} 
        color={color(pointProperties, pathProperties)}
        weight={weight(pointProperties, pathProperties)}
        opacity={opacity(pointProperties, pathProperties)}
        eventHandlers={{'click': onClick(i)}}/>
}

export default Rectangles
