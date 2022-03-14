
import { FC } from "react";
import { Polyline } from 'react-leaflet'

import { EventRenderer, PointData, RendererProps } from "../../../assets/models";


const Line: EventRenderer = ( { path, properties, onClick } ) => {
    
    const way = path.data.map((p: PointData) =>  p.pos ) 
    const color = { color: properties.color };

    return <Polyline 
        positions={way} 
        key={`${Math.random()}-line`}
        pathOptions={color} 
        eventHandlers={onClick(0)} />
}


export default Line;