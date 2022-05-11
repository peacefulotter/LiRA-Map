


import { LatLng } from 'Leaflet.MultiOptionsPolyline';
import { Polyline } from 'react-leaflet';
import { DEFAULT_COLOR, DEFAULT_OPACITY, DEFAULT_WIDTH } from '../../../assets/properties';
import { Renderer } from '../../../models/renderers';
import ArrowHead from './ArrowHead';


const Line: Renderer = ( { path, properties, onClick } ) => {

    const { color, width, opacity, direction } = properties

    const options = {
        color: color || DEFAULT_COLOR,
        weight: width || DEFAULT_WIDTH,
        opacity: opacity || DEFAULT_OPACITY
    }

    var origin = path[path.length - 2];
    var end = path[path.length - 1];

    if (direction === 0){
        origin = path[1];
        end = path[0];  
    }
    
    return <Polyline  
        positions={path}
        pathOptions={options}
        eventHandlers={{'click': onClick(0)}} 
    >
        {
        direction !== -1 &&
            <ArrowHead origin={origin} end={end} />
        }
        
    </Polyline>
}


export default Line;