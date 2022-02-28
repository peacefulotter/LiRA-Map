
import { ReactElement } from "react";
import L, { LatLng, LatLngBounds } from 'leaflet'
import { Rectangle, Circle, Polyline, LayerGroup } from 'react-leaflet'

import { RideData, PointData, createPointFunc, rendererFunc, Renderer, Measurement } from '../../assets/models'

import 'leaflet-hotline'

const getColor = (val: any, defaultColor: string): string => {
    if ( val < 0 )
        return defaultColor;

    const red: number = Math.min(val * 2, 1) * 255;
    const green: number = (val < 0.5 ? val +  0.5 : 2 - val * 2) * 255;                 
    return `rgb(${Math.round(red)}, ${Math.round(green)}, 0)`
}


/** ===== Utils Functions for the Renderers ===== **/
const createPoints = ( path: RideData, properties: Measurement, func: createPointFunc ) => {
    const elementPath: ReactElement[] = [];
    for ( let i = 0; i < path.data.length; i++ ) 
    {
        const point: PointData = path.data[i];        
        const elt = func( point.pos, i, properties )
        elementPath.push( elt )
    }
    return elementPath;
}

const createRectangle = ( pos: LatLng, i: number, properties: Measurement ): ReactElement => {
    const size: number = (properties.size || 1) / 10_000;
    const bounds: LatLngBounds = new LatLngBounds(
        [pos.lat - size / 2, pos.lng - size / 2],
        [pos.lat + size / 3, pos.lng + size / 1.2]
    );
        
    return <Rectangle 
        bounds={bounds} 
        key={`${pos.lat};${pos.lng};rectangle;${i}`}
        pathOptions={{ color: properties.defaultColor, weight: 4 }}/>
}

const createCircle = ( pos: LatLng, i: number, properties: Measurement ): ReactElement =>  {    
    return <Circle 
        center={[pos.lat, pos.lng]} 
        radius={properties.size ? properties.size : 4} 
        key={`${pos.lat};${pos.lng};circle;${i}`}
        pathOptions={{ color: properties.defaultColor, weight: 1 }}/>
}

const createLine = ( way: LatLng[], properties: Measurement ): ReactElement => {
    const color = { color: properties.defaultColor };
    return <Polyline 
        positions={way} 
        key={`${Math.random()}-line`}
        pathOptions={color} />
}

const createHotline = (way: RideData, properties: Measurement, map: any ): any => {
    console.log('createHotline');
    
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

const createHotpoint = (way: RideData, properties: Measurement, map: any ): any => {    
    return <LayerGroup children={way.data.map((p: PointData, i: number) => {
        const mappedValue: number = ((p.value || -9999) - (way.minValue || 0)) / ((way.maxValue || 1) - (way.minValue || 0))
        return <Circle 
            center={[p.pos.lat, p.pos.lng]} 
            radius={5} 
            key={`${p.pos.lat};${p.pos.lng};circle;${i}`}
            pathOptions={{ color: getColor(mappedValue, properties.defaultColor) }}/>
        })} /> 
}


/** ===== Renderers Function ===== **/

const createCircles: rendererFunc = ( path: RideData,  properties: Measurement): ReactElement[] => {
    return createPoints(path, properties, createCircle)
}

const createRectangles: rendererFunc = ( path: RideData, properties: Measurement): ReactElement[] => {
    return createPoints(path, properties, createRectangle)
}

const createLines: rendererFunc = ( path: RideData, properties: Measurement ): ReactElement => {
    const way = path.data.map((p: PointData) =>  p.pos ) 
    return way.length > 0 
        ? createLine( way, properties)
        : <></>
}

const createHotlines: rendererFunc = (path: RideData, properties: Measurement, map: any): any => {
    return ( path.data.length > 0 )
        ? createHotline( path, properties, map )
        : <></>
}

const createHotpoints: rendererFunc = (path: RideData, properties: Measurement, map: any): any => {
    return ( path.data.length > 0 )
        ? createHotpoint( path, properties, map )
        : <></>
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