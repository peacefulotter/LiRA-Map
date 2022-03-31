
import { FC } from "react";

import { PointData, PointProps, EventRendererProps } from "../../../assets/models";

interface Props extends EventRendererProps {
    PointElt: FC<PointProps>
}

/*
    Used to render Rectangles and Circles
*/
const Points: FC<Props> = ( { path, properties, onClick, PointElt } ) => {
    return (
        <>
        {
            path.map( (point: PointData, i: number) => {
                return <PointElt 
                    key={`PointElt${Math.random()}`}
                    lat={point.lat}
                    lng={point.lng} 
                    pointProperties={point.properties}
                    pathProperties={properties} 
                    onClick={onClick}
                    i={i} />
            } )
        }
        </>
    )
}

export default Points;