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
        const red: number = Math.max(val * 2, 1) * 255;                          // 0 -> 0, 0.5 -> 1, >0.5 -> 1
        const green: number = val < 0.5 ? 255 : Math.max(2 - val * 2, 0) * 255;  // 0 -> 1, 0.5 -> 1, 1 -> 0         
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
    const posA = pos[0]; 
    const posB = pos[1];
    return <Polyline 
        positions={[[posA.lat, posA.lng], [posB.lat, posB.lng]]} 
        key={`${posA.lat};${posA.lng};line;${i}`}
        pathOptions={{ color: color }} />
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
        
        if ( measurement === Measurements.Interpolation || measurement === Measurements.Engine_RPM  )
        {
            for ( let i = 0; i < path.length - 1; i++ )
            {
                let values = path.map((p: PointData) => p.value as number)
                let max = Math.max(...values)
                let min = Math.min(...values.filter((p: number) => p > 0))
                const value = (path[i].value as number - min) / (max - min)                
                const elt = createElement( [path[i].pos, path[i+1].pos], value, i, weight, properties )
                elementPath.push( elt )
            }
        }
        else
        {
            for ( let i = 0; i < path.length; i++ ) 
            {
                const point: PointData = path[i];
                console.log(point);
                
                const elt = createElement( [point.pos], point.value, i, weight, properties )
                elementPath.push( elt )
            } 
        }
        
        setP(elementPath);
    }, [path, measurement])    
    return ( <> { p } </> )
}

export default Path;
