

import { Polyline } from 'react-leaflet'

import { EventRenderer, PointData } from "../../../assets/models";


const Line: EventRenderer = ( { path, properties, onClick } ) => {
    
    const way = path.data.map((p: PointData) =>  p.pos ) 

    return <Polyline 
        positions={way} 
        key={`${Math.random()}-line`}
        pathOptions={{ 
            color: properties.color,
        }} 
        eventHandlers={{'click': onClick(0)}} />
}


export default Line;