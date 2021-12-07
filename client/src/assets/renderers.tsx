
import { FC, ReactElement } from "react";
import L, { LatLng, LatLngBounds } from 'leaflet'
import { Rectangle, Circle, Polyline, LayerGroup } from 'react-leaflet'
import 'leaflet-hotline'

import { RideData, PointData } from './models'
import { Measurement } from '../Components/Rides/Measurements'

const getColor = (val: any, defaultColor: string): string => {
    if ( val < 0 )
        return defaultColor;

    const red: number = Math.min(val * 2, 1) * 255;
    const green: number = (val < 0.5 ? val +  0.5 : 2 - val * 2) * 255;                 
    return `rgb(${Math.round(red)}, ${Math.round(green)}, 0)`
}

export type rendererFunc = (path: RideData, weight: number, properties: Measurement, map: any) => any;
type createPointFunc = (pos: LatLng, i: number, weight: number, properties: Measurement) => any;

/** ===== Utils Functions for the Renderers ===== **/

const createPoints = ( path: RideData, weight: number, properties: Measurement, func: createPointFunc ) => {
    const elementPath: ReactElement[] = [];
    for ( let i = 0; i < path.data.length; i++ ) 
    {
        const point: PointData = path.data[i];        
        const elt = func( point.pos, i, weight, properties )
        elementPath.push( elt )
    }
    return elementPath;
}

const createRectangle = ( pos: LatLng, i: number, weight: number, properties: Measurement ): ReactElement => {
    const size: number = properties.size || 0.0001;
    const bounds: LatLngBounds = new LatLngBounds(
        [pos.lat - size / 2, pos.lng - size / 2],
        [pos.lat + size / 3, pos.lng + size / 1.2]
    );
        
    return <Rectangle 
        bounds={bounds} 
        key={`${pos.lat};${pos.lng};rectangle;${i}`}
        pathOptions={{ color: properties.defaultColor, weight: weight }}/>
}

const createCircle = ( pos: LatLng, i: number, weight: number, properties: Measurement ): ReactElement =>  {
    return <Circle 
        center={[pos.lat, pos.lng]} 
        radius={1} 
        key={`${pos.lat};${pos.lng};circle;${i}`}
        pathOptions={{ color: properties.defaultColor, weight: weight }}/>
}

const createLine = ( way: LatLng[], properties: Measurement ): ReactElement => {
    const color = { color: properties.defaultColor };
    return <Polyline 
        positions={way} 
        key={`${Math.random()}-line`}
        pathOptions={color} />
}

const createHotline = (way: RideData, properties: Measurement, map: any ): any => {
    // the Z value determines the color
    const coords: [number, number, number][] = way.data
        .map( (point: PointData) => [point.pos.lat, point.pos.lng, point.value || 0])

    return L.hotline(coords, {
        weight: 4,
        outlineWidth: 0,
        palette: {
            0.0: 'green',
            0.5: 'yellow',
            1.0: 'red'
        },
        min: way.minValue || 0,
        max: way.maxValue || 1
    }).addTo(map);
}

const createHotpoint = (way: RideData, weight: number, properties: Measurement, map: any ): any => {    
    return <LayerGroup children={way.data.map((p: PointData, i: number) => {
        const mappedValue: number = ((p.value || -9999) - (way.minValue || 0)) / ((way.maxValue || 1) - (way.minValue || 0))
        return <Circle 
            center={[p.pos.lat, p.pos.lng]} 
            radius={1} 
            key={`${p.pos.lat};${p.pos.lng};circle;${i}`}
            pathOptions={{ color: getColor(mappedValue, properties.defaultColor), weight: weight }}/>
        })} /> 
}


/** ===== Renderers Function ===== **/

const createCircles: rendererFunc = ( path: RideData, weight: number, properties: Measurement): ReactElement[] => {
    return createPoints(path, weight, properties, createRectangle)
}

const createRectangles: rendererFunc = ( path: RideData, weight: number, properties: Measurement): ReactElement[] => {
    return createPoints(path, weight, properties, createCircle)
}

const createLines: rendererFunc = ( path: RideData, weight: number, properties: Measurement ): ReactElement => {
    const way = path.data.map((p: PointData) =>  p.pos ) 
    return way.length > 0 
        ? createLine( way, properties)
        : <></>
}

const createHotlines: rendererFunc = (path: RideData, weight: number, properties: Measurement, map: any): any => {
    return ( path.data.length > 0 )
        ? createHotline( path, properties, map )
        : <></>
}

const createHotpoints: rendererFunc = (path: RideData, weight: number, properties: Measurement, map: any): any => {
    return ( path.data.length > 0 )
        ? createHotpoint( path, weight, properties, map )
        : <></>
}

export interface Renderer {
    name: string;
    func: rendererFunc
}

const Renderers: Renderer[] = [
    {
        name: 'Circles',
        func: createCircles
    }, 
    {
        name: 'Rectangles',
        func: createRectangles
    }, 
    {
        name: 'Lines',
        func: createLines
    }, 
    {
        name: 'Hotlines',
        func: createHotlines
    }, 
    {
        name: 'Hotpoints',
        func: createHotpoints
    }, 
]

export default Renderers;