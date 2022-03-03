

import { Circle, LayerGroup } from 'react-leaflet'

import { PointData, Renderer } from "../../../assets/models";

const getColor = (val: any, defaultColor: string): string => {
    if ( val < 0 )
        return defaultColor;

    const red: number = Math.min(val * 2, 1) * 255;
    const green: number = (val < 0.5 ? val +  0.5 : 2 - val * 2) * 255;                 
    return `rgb(${Math.round(red)}, ${Math.round(green)}, 0)`
}

const Hotpoints: Renderer = ( { path, properties, setSelected } ) => { 
    
    const circles = path.data.map( (p: PointData, i: number) => {
        
        const mappedValue: number = ((p.value || -9999) - (path.minValue || 0)) / ((path.maxValue || 1) - (path.minValue || 0))
        
        return <Circle 
            center={[p.pos.lat, p.pos.lng]} 
            radius={5} 
            key={`${p.pos.lat};${p.pos.lng};circle;${i}`}
            pathOptions={{ color: getColor(mappedValue, properties.color) }}
            eventHandlers={{click: () => setSelected(i)}}  />
    } )
    
    return <LayerGroup children={circles} /> 
}

export default Hotpoints