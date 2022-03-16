import L from 'leaflet'
import { useEffect } from 'react';
import { Circle, useMap } from "react-leaflet";
import { EventRenderer, PointData } from "../../../assets/models";
import useCanvas from './useCanvas';

const getColor = (val: any, defaultColor: string, i: number): string => {
    if ( val < 0 )
        return defaultColor;

    const red: number = Math.min(val * 2, 1) * 255;
    const green: number = (val < 0.5 ? val +  0.5 : 2 - val * 2) * 255;                 
    return `rgb(${Math.round(red)}, ${Math.round(green)}, 0)`
    // return `rgb(${i * 255}, 0, 0)`
}


const Hotpoints: EventRenderer = ( { path, properties, onClick } ) => { 

    const [map, canvas] = useCanvas();

    useEffect(() => {
        path.data.forEach( (p: PointData, i: number) => {
            const mappedValue: number = ((p.value || -9999) - (path.minValue || 0)) / ((path.maxValue || 1) - (path.minValue || 0))
            
            return L.circle( [p.pos.lat, p.pos.lng], { 
                renderer: canvas, 
                radius: properties.size,
                color: getColor(mappedValue, properties.color, i / path.data.length),
            } ).on("click", () => {}).addTo(map);
        } )
    }, [])

    return <></>;
}

export default Hotpoints