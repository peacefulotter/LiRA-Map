import { FC } from "react";
import { Circle } from "react-leaflet";
import { EventRenderer, Renderer } from "../../../assets/models";

/*
    Circle as Renderer 
*/

const RCircle: EventRenderer = ( { path, properties, onClick } ) =>  {   
    
    const { lat, lng } = path.data[0].pos

    return <Circle
        center={[lat, lng]} 
        radius={properties.size ? properties.size : 4} 
        key={`Circle${Math.random()}`}
        pathOptions={{ color: properties.color, weight: 1 }}
        eventHandlers={onClick(0)}/>
}

export default RCircle;