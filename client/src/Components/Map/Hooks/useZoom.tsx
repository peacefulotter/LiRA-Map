import { Map } from 'leaflet'
import { useState } from "react";
import { useMapEvents } from "react-leaflet";


const useZoom = (): [number, Map] => {
    const [zoom, setZoom] = useState<number>(0)

    const map = useMapEvents({
        zoom: () => setZoom(map.getZoom())
    })

    return [zoom, map]
}

export default useZoom;