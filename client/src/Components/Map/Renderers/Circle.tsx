import { Circle } from "react-leaflet";
import { color, opacity, weight, width } from "../../../assets/properties";
import { PathProperties, PointProperties } from "../../../models/properties";
import { Renderer } from "../../../models/renderers";

/*
    Circle as Renderer 
*/

export const createCircle = (
    lat: number, lng: number, 
    pointProperties: PointProperties | undefined, 
    pathProperties: PathProperties, 
    onClick: (e: any) => void
) => {
    return <Circle
        center={[lat, lng]} 
        radius={width(pointProperties, pathProperties)} 
        weight={weight(pointProperties, pathProperties)}
        opacity={opacity(pointProperties, pathProperties)}
        color={color(pointProperties, pathProperties)}
        eventHandlers={{'click': onClick}}/>
}

const RCircle: Renderer = ( { path, properties, onClick } ) =>  {   
    const { lat, lng } = path[0]
    return createCircle(lat, lng, path[0].properties, properties, onClick(0))
}

export default RCircle;