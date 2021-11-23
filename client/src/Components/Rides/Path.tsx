import { FC, ReactElement, useEffect, useState } from "react";
import L, { LatLng, LatLngBounds } from 'leaflet'
import { Rectangle, Circle, Polyline } from 'react-leaflet'

import { MeasurementProperties, Measurements, RideData, PointData, MeasurementProperty } from '../../assets/models'


type Props = {
	path: RideData;
    measurement: Measurements;
    zoom: number;
};

type PathEltCreation = (pos: LatLng[], value: any, i: number, weight: number, properties: MeasurementProperty) => ReactElement

const getWeight = (n: number): number => { return n < 17 ? (n <= 15 ? 3 : 2) : 1 }
const getColor = (val: any, type: string | undefined, defaultColor: string): string => {
    if ( type === undefined ) 
        return defaultColor;
    else if ( type === 'number' ) {
        const red: number = Math.max(val * 2, 1)
        const green: number = Math.max(1 - val * 2, 0);
        return `rgb(${red}, ${green}, 0)`
    }
    else
        return '#000000'
}

const createRectangle = ( pos: LatLng[], value: any, i: number, weight: number, properties: MeasurementProperty ) => {
    const p = pos[0];
    const size: number = properties.size;
    const bounds: LatLngBounds = new LatLngBounds(
        [p.lat - size / 2, p.lng - size / 2],
        [p.lat + size / 3, p.lng + size / 1.2]
    );
        
    return <Rectangle 
                bounds={bounds} 
                key={`${p.lat};${p.lng};rectangle;${i}`}
                pathOptions={{ color: properties.color, weight: weight }}/>
}

const createCircle = ( pos: LatLng[], value: any, i: number, weight: number, properties: MeasurementProperty ) =>  {
    const p = pos[0]    
    return <Circle 
        center={[p.lat, p.lng]} 
        radius={1} 
        key={`${p.lat};${p.lng};circle;${i}`}
        pathOptions={{ color: properties.color, weight: weight }}/>
}

const createLines = ( pos: LatLng[], value: any, i: number, weight: number, properties: MeasurementProperty ) => {
    const color = value === undefined ? properties.color : getColor(value, properties.value, properties.color); 
    const posA = pos[0]; const posB = pos[1];
    return <Polyline 
        positions={[posA, posB]} 
        key={`${posA.lat};${posA.lng};circle;${i}`}
        pathOptions={{ color: properties.color }} />
}

const PATHS_CREATION: PathEltCreation[] = [
    createCircle,
    createLines,
    createRectangle,
    createLines,
]

const Path: FC<Props> = ( { path, measurement, zoom } ) => {

    const [p, setP] = useState<ReactElement[]>([]);

    useEffect( () => {
        if ( measurement === undefined ) return;

        const elementPath: ReactElement[] = [];
        const properties = MeasurementProperties[measurement]; 
        const createElement = PATHS_CREATION[measurement]      
        const weight = getWeight(zoom)        
        
        if ( measurement === Measurements.Interpolation )
        {
            for ( let i = 0; i < path.length - 1; i++ )
            {
                console.log(path[i]);
                const elt = createElement( [path[i].pos, path[i+1].pos], path[i].value, i, weight, properties )
                elementPath.push( elt )
            }
        }
        else
        {
            for ( let i = 0; i < path.length; i++ ) 
            {
                const point: PointData = path[i];
                const elt = createElement( [point.pos], point.value, i, weight, properties )
                elementPath.push( elt )
            } 
        }
        
        setP(elementPath);
    }, [path, measurement])    
    return ( <> { p } </> )
}

export default Path;
