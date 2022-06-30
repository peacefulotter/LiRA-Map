import  { useEffect, useState } from "react";

import MapWrapper from "../Components/Map/MapWrapper";
import Heatmap from "../Components/Map/Renderers/Heatmap";
import DistHotline from "../Components/Map/Renderers/DistHotline";

import { Node, ValueLatLng, WaysConditions } from "../models/path";

import { getAltitudes, getHeat } from "../queries/altitude";


import "../css/altitude.css";


const Altitude = () => {
    
    const [altitudes, setAltitudes] = useState<WaysConditions>()
    const [heat, setHeat] = useState<ValueLatLng[]>()

    useEffect( () => {
        getAltitudes( (data: WaysConditions) => {
            console.log(data);
            setAltitudes( data )
        } )

        // getHeat( (data: ValueLatLng[]) => {
        //     console.log(data);
        //     setHeat(data);
        // } )
    }, [] )

    return (
        <div className="altitude-wrapper">
            <MapWrapper>
                { altitudes ? 
                    <DistHotline 
                        way_ids={altitudes.way_ids} 
                        geometry={altitudes.geometry} 
                        conditions={altitudes.conditions}
                        options={{min: 0, max: 140}} /> 
                    : null 
                }
                { altitudes 
                    ? <Heatmap 
                        data={altitudes.geometry.flat()} 
                        getLat={(t: Node) => t.lat} 
                        getLng={(t: Node) => t.lng} 
                        getVal={(t: Node) => 2} 
                        max={1} 
                        radius={20} /> 
                    : null }
            </MapWrapper>
        </div>
    );
}

export default Altitude;