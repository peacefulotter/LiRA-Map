

import { FC } from "react";
import { PointProps, Renderer } from "../../../models/renderers";

import { createCircle } from "./Circle";
import Points from "./Points";

const Circles: Renderer = ( props ) => {
    return <Points {...props} PointElt={CCircle} />
}

const CCircle: FC<PointProps> = ( { lat, lng, pointProperties, pathProperties, onClick, i } ) =>  {    
    return createCircle(lat, lng, pointProperties, pathProperties, onClick(i))
}

export default Circles;

