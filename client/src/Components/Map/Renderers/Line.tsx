

import { Polyline } from 'react-leaflet'

import { EventRenderer, PointData } from "../../../assets/models";


const Line: EventRenderer = ( { path, properties, onClick } ) => {
    
    const way = path.data.map((p: PointData) =>  p.pos ) 

    return <Polyline 
        positions={way} 
        key={`${Math.random()}-line`}
        pathOptions={{ 
            color: properties.color,
            weight: properties.boldness || properties.size,
            opacity: properties.opacity || 1.0
        }} 
        eventHandlers={{'click': onClick(0)}} />
}


export default Line;