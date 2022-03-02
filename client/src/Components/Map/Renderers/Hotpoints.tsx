

import { FC } from 'react';
import { Circle, LayerGroup } from 'react-leaflet'

import { PointData, RendererProps } from "../../../assets/models";

const getColor = (val: any, defaultColor: string): string => {
    if ( val < 0 )
        return defaultColor;

    const red: number = Math.min(val * 2, 1) * 255;
    const green: number = (val < 0.5 ? val +  0.5 : 2 - val * 2) * 255;                 
    return `rgb(${Math.round(red)}, ${Math.round(green)}, 0)`
}

const Hotpoints: FC<RendererProps> = ( { path, properties, setMarker }) => { 
    
    const circles = path.data.map( (p: PointData, i: number) => {
        
        const mappedValue: number = ((p.value || -9999) - (path.minValue || 0)) / ((path.maxValue || 1) - (path.minValue || 0))
        
        return <Circle 
            center={[p.pos.lat, p.pos.lng]} 
            radius={5} 
            key={`${p.pos.lat};${p.pos.lng};circle;${i}`}
            pathOptions={{ color: getColor(mappedValue, properties.color) }}
            eventHandlers={{click: ({latlng}) => setMarker([latlng.lat, latlng.lng])}}  />
    } )
    
    return <LayerGroup children={circles} /> 
}

export default Hotpoints