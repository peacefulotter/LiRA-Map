import { FC, ReactElement, useEffect, useState } from "react";
import L, { LatLng, LatLngBounds } from 'leaflet'
import { Rectangle, Circle, Polyline } from 'react-leaflet'

import { RidePos, Measurements } from '../../assets/models'


type Props = {
	path: RidePos;
    measurement: Measurements;
    zoom: number;
};

type PathEltDetails = {
    createElement: (pos: LatLng[], i: number, weight: number, pathConfigs: PathEltDetails) => ReactElement
    color: string;
    size: number;
}

const getWeight = (n: number): number => { return n < 17 ? (n <= 15 ? 3 : 2) : 1 }

const createRectangle = ( pos: LatLng[], i: number, weight: number, pathConfigs: PathEltDetails ) => {
    const p = pos[0];
    const size: number = pathConfigs.size;
    const bounds: LatLngBounds = new LatLngBounds(
        [p.lat - size / 2, p.lng - size / 2],
        [p.lat + size / 3, p.lng + size / 1.2]
    );
        
    return <Rectangle 
                bounds={bounds} 
                key={`${p.lat};${p.lng};rectangle;${i}`}
                pathOptions={{ color: pathConfigs.color, weight: weight }}/>
}

const createCircle = ( pos: LatLng[], i: number, weight: number, pathConfigs: PathEltDetails ) =>  {
    const p = pos[0]
    return <Circle 
        center={[p.lat, p.lng]} 
        radius={1} 
        key={`${p.lat};${p.lng};circle;${i}`}
        pathOptions={{ color: pathConfigs.color, weight: weight }}/>
}

const createLines = ( pos: LatLng[], i: number, weight: number, pathConfigs: PathEltDetails ) => {
    const posA = pos[0]; const posB = pos[1];
    return <Polyline 
        positions={[posA, posB]} 
        key={`${posA.lat};${posA.lng};circle;${i}`}
        pathOptions={{ color: pathConfigs.color }} />
}

const PATHS: PathEltDetails[] = [
    { createElement: createCircle, color: "#0000CC", size: 1 },
    { createElement: createLines, color: '#2288FF', size: 1 },
    { createElement: createRectangle, color: "#FF00FF", size: 0.00003 },
]

const Path: FC<Props> = ( { path, measurement, zoom } ) => {

    const [p, setP] = useState<ReactElement[]>([]);

    useEffect( () => {
        if ( measurement === undefined ) return;

        const elementPath: ReactElement[] = []; 
        const pathConfigs = PATHS[measurement]      
        const weight = getWeight(zoom)        
        
        if ( measurement === Measurements.Interpolation )
        {
            for ( let i = 0; i < path.length - 1; i++ )
            {
                const elt = pathConfigs.createElement( [path[i], path[i+1]], i, weight, pathConfigs )
                elementPath.push( elt )
            }
        }
        else
        {
            for ( let i = 0; i < path.length; i++ ) 
            {
                const elt = pathConfigs.createElement( [path[0]], i, weight, pathConfigs )
                elementPath.push( elt )
            } 
        }
        
        setP(elementPath);
    }, [path, measurement])    

    return ( <> { p  } </> )
}

export default Path;
