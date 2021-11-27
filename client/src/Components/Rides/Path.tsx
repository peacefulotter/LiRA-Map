import { FC, ReactElement, useEffect, useState } from "react";
import L, { LatLng, LatLngBounds } from 'leaflet'
import { Rectangle, Circle, Polyline } from 'react-leaflet'

import { MeasurementProperty, Measurements, MEASUREMENTS, RideData, PointData } from '../../assets/models'


type Props = {
	path: RideData;
    measurement: keyof Measurements;
    zoom: number;
};


const getWeight = (n: number): number => { return n < 17 ? (n <= 15 ? 3 : 2) : 1 }
const getColor = (val: any, type: string | undefined, defaultColor: string): string => {
    if ( type === undefined ) 
        return defaultColor;
    else if ( type === 'number' ) {
        const red: number = Math.min(val * 2, 1) * 255;                          // 0 -> 0, 0.5 -> 1, >0.5 -> 1
        const green: number = val < 0.5 ? 255 : Math.max(2 - val * 2, 0) * 255;  // 0 -> 1, 0.5 -> 1, 1 -> 0                 
        return `rgb(${red}, ${green}, 0)`
    }
    else
        return '#000000'
}

type createPointFunc = (pos: LatLng, i: number, weight: number, properties: MeasurementProperty) => ReactElement;

export const createRectangle = ( pos: LatLng, i: number, weight: number, properties: MeasurementProperty ): ReactElement => {
    const size: number = properties.size;
    const bounds: LatLngBounds = new LatLngBounds(
        [pos.lat - size / 2, pos.lng - size / 2],
        [pos.lat + size / 3, pos.lng + size / 1.2]
    );
        
    return <Rectangle 
        bounds={bounds} 
        key={`${pos.lat};${pos.lng};rectangle;${i}`}
        pathOptions={{ color: properties.color, weight: weight }}/>
}

export const createCircle = ( pos: LatLng, i: number, weight: number, properties: MeasurementProperty ): ReactElement =>  {
    return <Circle 
        center={[pos.lat, pos.lng]} 
        radius={1} 
        key={`${pos.lat};${pos.lng};circle;${i}`}
        pathOptions={{ color: properties.color, weight: weight }}/>
}

export const createPoints = ( path: RideData, weight: number, properties: MeasurementProperty, createPoint: createPointFunc): ReactElement[] => {
    const elementPath: ReactElement[] = [];
    for ( let i = 0; i < path.length; i++ ) 
    {
        const point: PointData = path[i];        
        const elt = createPoint( point.pos, i, weight, properties )
        elementPath.push( elt )
    }
    return elementPath;
}

const createLine = (a: LatLng, b: LatLng, value: number, i: number, properties: MeasurementProperty): ReactElement => {
    const color = getColor(value, properties.value, properties.color); 
    return <Polyline 
        positions={[[a.lat, a.lng], [b.lat, b.lng]]} 
        key={`${a.lat};${a.lng};line;${i}`}
        pathOptions={{ color: color }} />
}

export const createLines = ( path: RideData, weight: number, properties: MeasurementProperty ): ReactElement[] => {
    const elementPath: ReactElement[] = [];
    const min = properties.minValue || 0;
    const max = properties.maxValue || 1;

    for ( let i = 0; i < path.length - 1; i++ )
    {                
        const value = (path[i].value as number - min) / (max - min)              
        const elt = createLine( path[i].pos, path[i+1].pos, value, i, properties )
        elementPath.push( elt )
    }

    return elementPath;
}

const Path: FC<Props> = ( { path, measurement, zoom } ) => {

    const [p, setP] = useState<ReactElement[]>([]);

    useEffect( () => {
        if ( measurement === undefined ) return;

        const properties: MeasurementProperty = MEASUREMENTS[measurement]; 
        const weight = getWeight(zoom)  
        const elements = properties.createElements(path, weight, properties)

        setP(elements);

    }, [path, measurement])  

    return ( <> { p } </> )
}

export default Path;
