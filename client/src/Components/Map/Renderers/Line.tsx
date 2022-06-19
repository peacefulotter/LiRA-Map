


import { Polyline } from 'react-leaflet';
import { fixProperties } from '../../../assets/properties';
import { Renderer } from '../../../models/renderers';
import ArrowHead from './ArrowHead';


const Line: Renderer = ( { path, properties, onClick } ) => {

    const _properties = fixProperties(undefined, properties) 
    const { arrowHead } = properties;

    const origin = path[path.length - 2];
    const end = path[path.length - 1];  
    
    return <Polyline  
        positions={path}
        pathOptions={_properties}
        eventHandlers={{'click': onClick(0)}} 
    >
        { arrowHead === 1  ? <ArrowHead origin={origin} end={end} /> : null }
        { arrowHead === 2  ? <ArrowHead origin={end} end={origin} /> : null }
    </Polyline>
}


export default Line;