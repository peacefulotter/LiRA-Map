import { FC } from "react";

import Measurement from './Measurement'
import {MeasurementData} from '../../assets/models';

import '../../css/rides.css'

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