import L from 'leaflet'
import { useEffect } from 'react';
import { EventRenderer, PointData } from "../../../assets/models";
import useCanvas from '../Hooks/useCanvas';

const getColor = (val: any, defaultColor: string | undefined, i: number): string => {
    if ( val < 0 )
        return defaultColor || 'orange';

    const red: number = Math.min(val * 2, 1) * 255;
    const green: number = (val < 0.5 ? val +  0.5 : 2 - val * 2) * 255;                 
    return `rgb(${Math.round(red)}, ${Math.round(green)}, 0)`
    // return `rgb(${i * 255}, 0, 0)`
}


const Hotpoints: EventRenderer = ( { path, properties, onClick, minValue, maxValue } ) => { 

    const [map, canvas] = useCanvas();

    useEffect(() => {
        path.forEach( (p: PointData, i: number) => {
            const mappedValue: number = ((p.value || -9999) - (minValue || 0)) / ((maxValue || 1) - (minValue || 0))
            return L.circle( [p.lat, p.lng], { 
                renderer: canvas, 
                radius: properties.width,
                color: getColor(mappedValue, properties.color, i / path.length),
                weight: properties.weight || 4,
                opacity: properties.opacity || 1.0
            } ).on("click", onClick(i)).addTo(map);
        } )
    }, [])

    return <></>;
}

export default Hotpoints