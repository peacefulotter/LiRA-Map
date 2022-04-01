

import { Polyline } from 'react-leaflet'

import { EventRenderer } from "../../../assets/models";
import { DEFAULT_COLOR, DEFAULT_OPACITY, DEFAULT_WIDTH } from '../../../assets/properties';


const Line: EventRenderer = ( { path, properties, onClick } ) => {
    
    return <Polyline 
        positions={path}
        key={`${Math.random()}-line`}
        pathOptions={{
            color: properties.color || DEFAULT_COLOR,
            weight: properties.width || DEFAULT_WIDTH,
            opacity: properties.opacity || DEFAULT_OPACITY
        }} 
        eventHandlers={{'click': onClick(0)}} />
}


export default Line;