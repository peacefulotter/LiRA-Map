
import { FC } from "react";
import { Polyline } from 'react-leaflet'

import { PointData, RendererProps } from "../../../assets/models";


const Line: FC<RendererProps> = ( { path, properties, setSelected } ) => {
    
    const way = path.data.map((p: PointData) =>  p.pos ) 
    const color = { color: properties.color };

    return <Polyline 
        positions={way} 
        key={`${Math.random()}-line`}
        pathOptions={color} 
        eventHandlers={{click: () => setSelected(0)}} />
}


export default Line;