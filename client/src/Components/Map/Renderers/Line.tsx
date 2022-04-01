

import { Polyline } from 'react-leaflet'

import { DEFAULT_COLOR, DEFAULT_OPACITY, DEFAULT_WIDTH } from '../../../assets/properties';
import { EventRenderer } from '../../../models/renderers';


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