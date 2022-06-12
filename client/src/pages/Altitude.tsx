import  { useEffect, useState } from "react";

import MapWrapper from "../Components/Map/MapWrapper";
import RCHotline from "../Components/RoadCondition/RCHotline";

import {  MapConditions } from "../models/path";

import { getAltitudes } from "../queries/altitude";

import "../css/road_conditions.css";

const Altitude = () => {
    
    const [altitudes, setAltitudes] = useState<MapConditions>()

    useEffect( () => {
        getAltitudes( (data: MapConditions) => {
            console.log(data);
            setAltitudes( data )
        } )
    }, [] )

    return (
        <div className="ml-wrapper">
            <div className="ml-map">
                <MapWrapper>
                    { altitudes ? <RCHotline mcs={altitudes} /> : null }
                </MapWrapper>
            </div>
        </div>
    );
}

export default Altitude;