
import { FC } from "react";
import { Rectangle } from "react-leaflet";
import { LatLngBounds } from 'leaflet'

import Points from "./Points";
import { fixProperties } from "../../../assets/properties";
import { Renderer, PointProps } from "../../../models/renderers";


const Rectangles: Renderer = ( props ) => {
    return <Points {...props} PointElt={CRectangle}/>
}

const CRectangle: FC<PointProps> = ( { lat, lng, pointProperties, pathProperties, onClick, i } ) => {

    const { width, color, weight, opacity } = fixProperties(pointProperties, pathProperties)

    const size: number = width / 10_000;
    const bounds: LatLngBounds = new LatLngBounds(
        [lat - size / 2, lng - size / 2],
        [lat + size / 3, lng + size / 1.2]
    );
        
    return <Rectangle
        bounds={bounds} 
        color={color}
        weight={weight}
        opacity={opacity}
        eventHandlers={{'click': onClick ? onClick(i) : () => {}}}/>
}

export default Rectangles
