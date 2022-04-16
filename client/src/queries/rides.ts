import { Dispatch, SetStateAction } from "react"
import { RideMeta } from "../models/models"
import { DataPath } from "../models/path"
import { PopupFunc } from "../models/popup"
import { RideMeasurement } from "../models/properties"
import { get, post } from "./fetch"


export const getRides = ( callback: Dispatch<SetStateAction<RideMeta[]>> ) => {
    get( '/rides', callback )
}


export const getRide = (
    measurement: RideMeasurement, popup: PopupFunc,
    tripId: string, taskId: number, 
    callback: (dp: DataPath) => void
) => {

    const { query, queryMeasurement, name, hasValue } = measurement

    console.log('Querying measurement: ', name, '\nTaskId: ', taskId );
    
    post( query, { tripID: tripId, measurement: queryMeasurement }, (dataPath: DataPath) => {            
        
        const { path } = dataPath;

        console.log("Got data for ride: ", taskId, "\nLength: ", path.length, '\nMeasurement: ', name, '\nHasValue?: ', hasValue ); 

        if ( path.length === 0 )
            return popup( {
                icon: "warning",
                title: `This trip doesn't contain data for ${name}`,
                footer: `TripId: ${tripId} | TaskId: ${taskId}`
            } );

                    
        callback( dataPath )
    })
}