import  { useEffect, useState } from "react";
// import HeatmapLayer from 'react-leaflet-heatmap-layer';

import MapWrapper from "../Components/Map/MapWrapper";
import RCHotline from "../Components/RoadCondition/RCHotline";
import Heatmap from "../Components/Map/Renderers/Heatmap";

import {  MapConditions, ValueLatLng } from "../models/path";

import { getAltitudes, getHeat } from "../queries/altitude";


import "../css/altitude.css";

const Altitude = () => {
    
    const [altitudes, setAltitudes] = useState<MapConditions>()
    const [heat, setHeat] = useState<ValueLatLng[]>()

    useEffect( () => {
        getAltitudes( (data: MapConditions) => {
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
                { altitudes ? <RCHotline mcs={altitudes} /> : null }
                { heat ? <Heatmap data={heat} /> : null }
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