import { FC, ReactElement } from "react";
import L, { LatLng, LatLngBounds } from 'leaflet'
import { Rectangle, Circle } from 'react-leaflet'

import { RidePos, Measurements } from '../../assets/models'


type Props = {
	path: RidePos;
    measurement: Measurements;
    zoom: number;
};

type PathEltDetails = {
    createElement: (pos: LatLng, i: number, weight: number, pathConfigs: PathEltDetails) => ReactElement;
    color: string;
    size: number;
}

const getWeight = (n: number): number => { return n < 17 ? (n <= 15 ? 3 : 2) : 1 }

const createRectangle = ( pos: LatLng, i: number, weight: number, pathConfigs: PathEltDetails ) => {
    const size: number = pathConfigs.size;
    const bounds: LatLngBounds = new LatLngBounds(
        [pos.lat - size / 2, pos.lng - size / 2],
        [pos.lat + size / 3, pos.lng + size / 1.2]
    );
        
    return <Rectangle 
                bounds={bounds} 
                key={`${pos.lat};${pos.lng};rectangle;${i}`}
                pathOptions={{ color: pathConfigs.color, weight: weight }}/>
}

const createCircle = ( pos: LatLng, i: number, weight: number, pathConfigs: PathEltDetails ) =>  {
    return <Circle 
        center={[pos.lat, pos.lng]} 
        radius={1} 
        key={`${pos.lat};${pos.lng};circle;${i}`}
        pathOptions={{ color: pathConfigs.color, weight: weight }}/>
}

const PATHS: PathEltDetails[] = [
    { createElement: createCircle, color: "#0000CC", size: 1 },
    { createElement: createRectangle, color: "#FF00FF", size: 0.00003 },
]

const Path: FC<Props> = ( { path, measurement, zoom } ) => {
    if ( measurement === undefined || path === undefined ) return <></>
    
    const pathConfigs = PATHS[measurement]        
    const weight = getWeight(zoom)    

    return ( <> { 
        path.map( (pos: LatLng, i: number ) => {
            return pathConfigs.createElement(pos, i, weight, pathConfigs)
        } ) 
    } </> )
}

export default Path;
