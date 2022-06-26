
import { Map } from 'leaflet'
import { useState } from 'react';
import { useMapEvents } from "react-leaflet";

import { MapBounds } from '../../../models/map';


const useMapBounds = (): MapBounds => {

    const toMapBounds = (map: Map) => {
        const b = map.getBounds()
        const { lat: maxLat, lng: minLng } = b.getNorthWest()
        const { lat: minLat, lng: maxLng } = b.getSouthEast()
        return { minLat, maxLat, minLng, maxLng }
    }

    const map = useMapEvents({
        moveend: () => setBounds(toMapBounds(map))
    })

    const [bounds, setBounds] = useState<MapBounds>(toMapBounds(map))

    return bounds;
}

export default useMapBounds