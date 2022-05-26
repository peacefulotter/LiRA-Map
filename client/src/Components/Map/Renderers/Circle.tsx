import { Circle } from "react-leaflet";
import { fixProperties } from "../../../assets/properties";
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

    const { width, weight, opacity, color } = fixProperties(pointProperties, pathProperties)

    return <Circle
        center={[lat, lng]} 
        radius={width} 
        weight={weight}
        opacity={opacity}
        color={color}
        eventHandlers={{'click': onClick}}/>
}

const RCircle: Renderer = ( { path, properties, onClick } ) =>  {   
    const { lat, lng } = path[0]
    const clickEvent = onClick ? onClick(0) : (e: any) => {}
    return createCircle(lat, lng, path[0].properties, properties, clickEvent)
}

export default RCircle;