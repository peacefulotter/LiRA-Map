import { FC } from "react";
import { Polyline } from "react-leaflet";
import { LatLng } from "../../../models/models";

interface IArrowHead {
    origin: LatLng
    end: LatLng
}

const length = (x: number, y: number) => Math.sqrt( x * x + y * y )


const ArrowHead: FC<IArrowHead> = ( { origin, end } ) => {

    const options = {
        color: 'purple',
        weight: 5
    }

    // inverse vec
    const size = 0.001

    const x = (end.lat - origin.lat) 
    const y = (end.lng - origin.lng)

    const edge = (angle: number) => {
        const theta = (angle * Math.PI) / 180.0;
        // rotate
        const rotX = x * Math.cos(theta) - y * Math.sin(theta)
        const rotY = x * Math.sin(theta) + y * Math.cos(theta)
        // normalize and extends
        const l = length(rotX, rotY)
        const nX = (rotX / l) * size
        const nY = (rotY / l) * size * 2

        // move to origin
        const edgeX = nX + end.lat
        const edgeY = nY + end.lng 

        return { lat: edgeX, lng: edgeY }
    }

    const arrows = [
        edge(120),
        end,
        edge(210)
    ]

    return <Polyline positions={arrows} pathOptions={options}/>
}


export default ArrowHead;