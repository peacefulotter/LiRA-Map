


import { Polyline } from 'react-leaflet';
import { DEFAULT_COLOR, DEFAULT_OPACITY, DEFAULT_WIDTH } from '../../../assets/properties';
import { Renderer } from '../../../models/renderers';
import ArrowHead from './ArrowHead';


const Line: Renderer = ( { path, properties, onClick } ) => {

    const { color, width, opacity } = properties

    console.log(path);
    

    const options = {
        color: color || DEFAULT_COLOR,
        weight: width || DEFAULT_WIDTH,
        opacity: opacity || DEFAULT_OPACITY
    }

    const origin = path[path.length - 2]
    const end = path[path.length - 1]
    
    return <Polyline  
        positions={path}
        pathOptions={options}
        eventHandlers={{'click': onClick(0)}} 
    >
        <ArrowHead origin={origin} end={end} options={options}/>
    </Polyline>
}


export default Line;