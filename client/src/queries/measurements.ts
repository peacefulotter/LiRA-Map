import { MeasProperties, ActiveMeasProperties } from "../models/properties";
import { get, put } from "./fetch";


export const getMeasurements = ( callback: React.Dispatch<React.SetStateAction<ActiveMeasProperties[]>> ) => {
    get('/measurements', (data: MeasProperties[]) => {
        // console.log("Data:\n");
        // console.log(data); // DevURL
        callback( data.map( meas => {
            return { ...meas, isActive: true }
        } ) )
    })
}

export const addMeasurement = (measurement: MeasProperties) => {
	put('/measurements/add', measurement)	
}

export const editMeasurement = (measurement: MeasProperties, index: number) => {
	put('/measurements/edit', { measurement, index } )	
}