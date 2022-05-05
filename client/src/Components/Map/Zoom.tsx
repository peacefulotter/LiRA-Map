
import { useEffect } from "react"
import { useMapEvents, ZoomControl } from "react-leaflet"
import { useZoom } from "../../context/ZoomContext"

const Zoom = () => {

    const { zoom, setZoom } = useZoom()

    const update = () => setZoom(map.getZoom())

    const map = useMapEvents({
        zoom: update
    })

    useEffect( update, [] )

    return (
        <>
        <div className="map-zoom">{zoom}</div>
        <ZoomControl position='topright'/>
        </>
    )
}

export default Zoom