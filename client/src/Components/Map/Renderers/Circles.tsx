

import { FC } from "react";

import { EventRenderer, PointProps } from "../../../assets/models";
import { createCircle } from "./Circle";
import Points from "./Points";

const Circles: EventRenderer = ( props ) => {
    return <Points {...props} PointElt={CCircle} />
}

const CCircle: FC<PointProps> = ( { lat, lng, pointProperties, pathProperties, onClick, i } ) =>  {    
    return createCircle(lat, lng, pointProperties, pathProperties, onClick(i))
}

export default Circles;

