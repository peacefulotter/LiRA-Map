import { FC, useEffect } from "react";
import { useMap } from "react-leaflet";
import L from 'leaflet'
import "leaflet.heat"

import { ValueLatLng } from "../../../models/path";


interface IHeatmap {
    data: any;
}


const Heatmap: FC<IHeatmap> = ( { data } ) => {
    
    const map = useMap()

    useEffect( () => {
        const points = data.map( (p: ValueLatLng) => [p.lat, p.lng, p.value] );
        const layer = (L as any).heatLayer(points, {
            max: 147,
            radius: 20,
            gradient: { 0.0: 'blue', 0.5: 'white', 1.0: 'red' }
        })
        layer.addTo(map);
        return () => layer.remove()
    }, [] )

    return null;
}

export default Heatmap;
