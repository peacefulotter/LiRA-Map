import { FC, ReactElement, useEffect, useState } from "react";
import L, { LatLng, LatLngBounds } from 'leaflet'
import { Rectangle, Circle, Polyline } from 'react-leaflet'
import 'leaflet-hotline'

import { MeasurementProperty, Measurements, MEASUREMENTS, RideData, PointData } from '../../assets/models'


type Props = {
	path: RideData;
    measurement: keyof Measurements;
    zoom: number;
    map: any;
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


const createMultiLine = (way: RideData, properties: MeasurementProperty, map: any ): any => {
    // the Z value determines the color
    const coords: [number, number, number][] = way
        .map((point: PointData, i: number) => [point.pos.lat, point.pos.lng, point.value || 0])

    return L.hotline(coords, {
        weight: 4,
        outlineWidth: 1,
        palette: {
            0.0: 'green',
            0.5: 'yellow',
            1.0: 'red'
        },
        min: properties.minValue || 0,
        max: properties.maxValue || 1
    }).addTo(map);
}

export const createMultiLines = (path: RideData, weight: number, properties: MeasurementProperty, map: any): any => {
    return ( path.length > 0 )
        ? createMultiLine( path, properties, map )
        : <></>
}

const createLine = ( way: LatLng[], values: number[], properties: MeasurementProperty ): ReactElement => {
    const color = { color: properties.color };
    return <Polyline 
        positions={way} 
        key={`${Math.random()}-line`}
        pathOptions={color} />
}

export const createLines = ( path: RideData, weight: number, properties: MeasurementProperty ): ReactElement => {
    const values: number[] = [0]
    const way = path.map((p: PointData) =>  p.pos ) 
    
    return way.length > 0 
        ? createLine( way, values, properties)
        : <></>
}

const Path: FC<Props> = ( { path, measurement, zoom, map } ) => {

    const [p, setP] = useState<ReactElement | ReactElement[]>([]);

    useEffect( () => {
        if ( measurement === undefined ) return;

        const properties: MeasurementProperty = MEASUREMENTS[measurement]; 
        const weight = getWeight(zoom)  
        const elements: any = properties.createElements(path, weight, properties, map)

        // use elements.remove to distinguish ReactElement(s) and leaflet object(s)
        if ( !elements.remove )
            setP(elements);

        return () => {
            if ( elements.remove )
                elements.remove(map)
        }

    }, [path, measurement])  

    return ( <> { p } </> )
}

export default Path;
