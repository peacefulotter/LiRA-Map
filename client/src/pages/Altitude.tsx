import  { useEffect, useState } from "react";

import MapWrapper from "../Components/Map/MapWrapper";
import Heatmap from "../Components/Map/Renderers/Heatmap";
import DistHotline from "../Components/Map/Renderers/DistHotline";

import { ValueLatLng, WaysConditions } from "../models/path";

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
                { altitudes ? <DistHotline way_ids={altitudes.way_ids} geometry={altitudes.geometry} conditions={altitudes.conditions} /> : null }
                { heat 
                    ? <Heatmap 
                        data={heat} 
                        getLat={(t: ValueLatLng) => t.lat} 
                        getLng={(t: ValueLatLng) => t.lng} 
                        getVal={(t: ValueLatLng) => t.value} 
                        max={147} 
                        radius={20} /> 
                    : null }
                {/* { heat 
                    ? <HeatmapLayer
                        fitBoundsOnLoad
                        fitBoundsOnUpdate
                        points={heat}
                        longitudeExtractor={(p: ValueLatLng) => p.lng}
                        latitudeExtractor={(p: ValueLatLng) => p.lat}
                        intensityExtractor={(p: ValueLatLng) => p.value}
                        gradient={{ 0: 'blue', 0.5: 'white', 1.0: 'red' }} /> 
                    : null 
                } */}
            </MapWrapper>
        </div>
    );
}

export default Altitude;