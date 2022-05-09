import { Measurement, RideMeasurement } from "../models/properties";
import { get, put } from "./fetch";


export const getMeasurements = ( callback: React.Dispatch<React.SetStateAction<RideMeasurement[]>> ) => {
    get('/measurements', (data: Measurement[]) => {
        console.log(data);
        callback( data.map( meas => { 
            return { ...meas, isActive: false } 
        } ) )
    })
}

export const addMeasurement = (measurement: Measurement) => {
	put('/measurements/add', measurement)	
}

export const editMeasurement = (measurement: Measurement, index: number) => {
	put('/measurements/edit', { measurement, index } )	
}