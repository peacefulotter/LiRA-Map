import { FC, ReactElement, useEffect, useState } from "react";
import L, { LatLng, LatLngBounds, LineCapShape } from 'leaflet'
import { Rectangle, Circle, Polyline, LayerGroup } from 'react-leaflet'
import 'leaflet-hotline'

import { MeasurementProperty, Measurements, MEASUREMENTS, RideData, PointData } from '../../assets/models'


type Props = {
	path: RideData;
    measurement: keyof Measurements;
    zoom: number;
    map: any;
};


const getWeight = (n: number): number => { return n < 17 ? (n <= 15 ? 3 : 2) : 1 }
const getColor = (val: any): string => {    
    const red: number = Math.min(val * 2, 1) * 255;    // 0 -> 0, 0.5 -> 1, >0.5 -> 1
    const green: number = (val < 0.5 ? val +  0.5 : 2 - val * 2) * 255;  // 0 -> 1, 0.5 -> 1, 1 -> 0                 
    return `rgb(${Math.round(red)}, ${Math.round(green)}, 0)`
}

type createPointFunc = (pos: LatLng, i: number, weight: number, properties: MeasurementProperty) => ReactElement;

export const createRectangle = ( pos: LatLng, i: number, weight: number, properties: MeasurementProperty ): ReactElement => {
    const size: number = properties.size; // / 1000;
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
    for ( let i = 0; i < path.data.length; i++ ) 
    {
        const point: PointData = path.data[i];        
        const elt = createPoint( point.pos, i, weight, properties )
        elementPath.push( elt )
    }
    return elementPath;
}


// const createHotline = (way: RideData, properties: MeasurementProperty, map: any ): any => {
//     // the Z value determines the color
//     const coords: [number, number, number][] = way
//         .map((point: PointData, i: number) => [point.pos.lat, point.pos.lng, point.value || 0])

//     return L.hotline(coords, {
//         weight: 4,
//         outlineWidth: 1,
//         palette: {
//             0.0: 'green',
//             0.5: 'yellow',
//             1.0: 'red'
//         },
//         min: properties.minValue || 0,
//         max: properties.maxValue || 1
//     }).addTo(map);
// }

// export const createHotlines = (path: RideData, weight: number, properties: MeasurementProperty, map: any): any => {
//     return ( path.length > 0 )
//         ? createHotline( path, properties, map )
//         : <></>
// }

const createHotline = (way: RideData, weight: number, properties: MeasurementProperty, map: any ): any => {    
    return <LayerGroup children={way.data.map((p: PointData, i: number) => {
        const mappedValue: number = ((p.value || 0) - (way.minValue || 0)) / ((way.maxValue || 1) - (way.minValue || 0))
        return <Circle 
            center={[p.pos.lat, p.pos.lng]} 
            radius={1} 
            key={`${p.pos.lat};${p.pos.lng};circle;${i}`}
            pathOptions={{ color: getColor(mappedValue), weight: weight }}/>
        })} /> 
}

export const createHotlines = (path: RideData, weight: number, properties: MeasurementProperty, map: any): any => {
    return ( path.data.length > 0 )
        ? createHotline( path, weight, properties, map )
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
    const way = path.data.map((p: PointData) =>  p.pos ) 
    
    return way.length > 0 
        ? createLine( way, values, properties)
        : <></>
}

// FIXME: remove the useEffect and the useState
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
