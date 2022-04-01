import { Measurement, RideMeasurement } from "../models/models";
import { get } from "./fetch";


const getMeasurements = ( callback: React.Dispatch<React.SetStateAction<RideMeasurement[]>> ) => {
    get('/measurements', (data: Measurement[]) => {
        console.log(data);
        callback( data.map(meas => { 
            return { ...meas, isActive: false } 
        } ) )
    })
}

export default getMeasurements;