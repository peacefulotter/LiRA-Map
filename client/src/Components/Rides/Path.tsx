import { FC, ReactElement } from "react";
import { LatLng, LatLngBounds } from 'leaflet'
import { Rectangle, Circle } from 'react-leaflet'

import { RidePos, Measurements } from '../../assets/models'


type Props = {
	path: RidePos;
    measurement: Measurements;
};

type PathEltDetails = {
    createElement: (pos: LatLng, i: number, pathConfigs: PathEltDetails) => ReactElement;
    color: string;
    size: number;
}

const createRectangle = ( pos: LatLng, i: number, pathConfigs: PathEltDetails ) => {
    const size: number = pathConfigs.size;
    const bounds: LatLngBounds = new LatLngBounds(
        [pos.lat - size / 2, pos.lng - size / 2],
        [pos.lat + size / 2, pos.lng + size / 2]
    );

    return <Rectangle 
                bounds={bounds} 
                key={'circle' + i} 
                color={pathConfigs.color}/>
}

const createCircle = ( pos: LatLng, i: number, pathConfigs: PathEltDetails ) =>  {
    return <Circle 
        center={[pos.lat, pos.lng]} 
        radius={1} 
        key={'circle' + i} 
        color={pathConfigs.color}/>
}

const PATHS: PathEltDetails[] = [
    { createElement: createCircle, color: "#0000CC", size: 1 },
    { createElement: createRectangle, color: "#FF00FF", size: 0.0001 },
]

const Path: FC<Props> = ( { path, measurement } ) => {

    const pathConfigs = PATHS[measurement]
    console.log(measurement);
    
    console.log(pathConfigs);
    

    return ( <> { 
        path.map( (pos: LatLng, i: number ) => {
            return pathConfigs.createElement(pos, i, pathConfigs)
        } ) 
    } </> )
}

export default Path;
