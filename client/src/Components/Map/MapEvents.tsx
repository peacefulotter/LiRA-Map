import { useMapEvents } from "react-leaflet"



const MapEvents = () => {
    useMapEvents({
        click: (e) => console.log(e.latlng)
    })

    return <></>
}

export default MapEvents;