import { FC, useState, useEffect } from "react";
import { MapContainer, TileLayer, useMapEvent,  } from 'react-leaflet'

import '../../css/rides.css'
import { isPropertySignature } from "typescript";
import Measurement from './Measurement'
import {MeasurementData} from '../../assets/models';

interface MeasurementsProps {
    measurements: MeasurementData[] 
}

const Measurements: FC<MeasurementsProps> = (props) => {
    return (
        <div>
            { props.measurements.map( (data: MeasurementData, i: number) =>      
                <Measurement key={`measurement-${i}`} lat={data.lat} lon={data.lon} message={data.message}/>
            )}
        </div>
  )
}

export default Measurements;