import { FC, useState } from "react";
import { MapContainer, TileLayer } from 'react-leaflet'

import Measurements from "./Measurements";
import MapEvents from "./MapEvents"

import { MeasurementData } from '../../../../assets/models';

import '../../../../css/rides.css'

const Map: FC = () => {

    const [ measurements, setMeasurements ] = useState<MeasurementData[]>([]);

    
    return (
        <div className="rides-wrapper">
            <div className="map-container">
                <MapContainer
                    preferCanvas={true}
                    center={[55.6720619937223, 12.558746337890627]} 
                    zoom={18} 
                    scrollWheelZoom={true}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapEvents setMeasurements = {setMeasurements} ></MapEvents>
                    <Measurements measurements = {measurements}></Measurements>
                </MapContainer>
            </div>
      </div>
    
  )
}

export default Map;
