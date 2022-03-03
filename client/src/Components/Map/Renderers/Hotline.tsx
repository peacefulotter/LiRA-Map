
import L from 'leaflet'
import 'leaflet-hotline'
import { FC, useEffect } from 'react';
import { useMap } from 'react-leaflet';

import { PointData, RendererProps } from "../../../assets/models";

interface HotlineProps extends RendererProps {
    palette?: any
}


const Hotline: FC<HotlineProps> = ( { path, palette } ) => {

    const p = palette || {
        0.0: 'green',
        0.5: 'yellow',
        1.0: 'red'
    }

    const map = useMap()
    
    // the Z value determines the color
    const coords: [number, number, number][] = path.data
        .map( (point: PointData) => [point.pos.lat, point.pos.lng, point.value || 0])

    const hotline = L.hotline( coords, {
        weight: 4,
        outlineWidth: 0,
        palette: p,
        min: path.minValue || 0,
        max: path.maxValue || 1,
        onclick: (e: any) => console.log(e.target)
    } ).addTo(map);

    // remove from map when unload
    useEffect( () => () => hotline.remove(map), [])  

    return <></>
}

export default Hotline;