import { FC, ReactElement, useEffect, useState } from "react";
import { LatLng, LatLngBounds } from 'leaflet'
import { Rectangle, Circle, Polyline } from 'react-leaflet'
import ReactLeafletMultiOptionsPolyline from 'react-leaflet-multi-options-polyline'

import { MeasurementProperty, Measurements, MEASUREMENTS, RideData, PointData } from '../../assets/models'


type Props = {
	path: RideData;
    measurement: keyof Measurements;
    zoom: number
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

const createLine = (way: LatLng[], values: number[], properties: MeasurementProperty): ReactElement => {
    const colors = values.map(value => { return {'color': getColor(value, properties.value, properties.color) } } )
    console.log(way);
    console.log(colors);

    let a = <Polyline 
        positions={way} 
        key={`${Math.random()}-line`}
        pathOptions={colors[0]} />
        // dangerouslySetInnerHTML={{__html: DOMPurify.sanitize('<div>chocolat</div>')}} />
    console.log(a);
    return a
    
    // return <ReactLeafletMultiOptionsPolyline
    //     positions={way}
    //     options={colors}
    //     optionIdxFn={ (latLng: any, prevLatLng: any, i: number) => i }
    //     weight={5}
    //     lineCap='butt'
    //     opacity={0.75}
    //     smoothFactor={1}
    //     zoomAnimation={false} /> 
}

export const createLines = ( path: RideData, weight: number, properties: MeasurementProperty ): ReactElement => {
    const min = properties.minValue || 0;
    const max = properties.maxValue || 1;

    const values: number[] = []
    const way: LatLng[] = []
    path.forEach((p: PointData) => {
        values.push((p.value as number - min) / (max - min))
        way.push(p.pos)
    }) 
    
    return way.length > 0 
        ? createLine( way, values, properties)
        : <></>
}

const Path: FC<Props> = ( { path, measurement, zoom } ) => {

    const [p, setP] = useState<ReactElement | ReactElement[]>([]);

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
