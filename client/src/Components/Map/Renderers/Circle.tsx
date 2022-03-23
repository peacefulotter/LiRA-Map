import { FC } from "react";
import { Circle } from "react-leaflet";
import { EventRenderer, PathEventHandler, PathProperties, Renderer } from "../../../assets/models";

/*
    Circle as Renderer 
*/

export const createCircle = (lat: number, lng: number, properties: PathProperties, onClick: (e: any) => void) => {
    return <Circle
        center={[lat, lng]} 
        radius={properties.size} 
        weight={properties.boldness || 4}
        opacity={properties.opacity || 1.0}
        color={properties.color}
        eventHandlers={{'click': onClick}}/>
}

const RCircle: EventRenderer = ( { path, properties, onClick } ) =>  {   
    const { lat, lng } = path.data[0].pos
    return createCircle(lat, lng, properties, onClick(0))
}

export default RCircle;