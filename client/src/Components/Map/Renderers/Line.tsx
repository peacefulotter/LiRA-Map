
import { FC } from "react";
import { Polyline } from 'react-leaflet'

import { PointData, RendererProps } from "../../../assets/models";


const Line: FC<RendererProps> = ( { path, properties, setMarker } ) => {
    
    const way = path.data.map((p: PointData) =>  p.pos ) 
    const color = { color: properties.color };
    return <Polyline 
        positions={way} 
        key={`${Math.random()}-line`}
        pathOptions={color} 
        eventHandlers={{click: ({latlng}) => setMarker([latlng.lat, latlng.lng])}} />
}


export default Line;