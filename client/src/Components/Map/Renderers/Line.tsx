

import { Polyline } from 'react-leaflet'

import { EventRenderer, PointData } from "../../../assets/models";


const Line: EventRenderer = ( { path, properties, onClick } ) => {
    
    return <Polyline 
        positions={path}
        key={`${Math.random()}-line`}
        pathOptions={{
            color: properties.color,
            weight: properties.width,
            opacity: properties.opacity || 1.0
        }} 
        eventHandlers={{'click': onClick(0)}} />
}


export default Line;