import { Dispatch, SetStateAction } from "react"
import { RideMeta } from "../models/models"
import { BoundedPath } from "../models/path"
import { PopupFunc } from "../models/popup"
import { RideMeasurement } from "../models/properties"
import { get, post } from "./fetch"


export const getRides = ( callback: Dispatch<SetStateAction<RideMeta[]>> ) => {
    get( '/rides', callback )
}


export const getRide = (
    measurement: RideMeasurement, popup: PopupFunc,
    tripId: string, taskId: number, 
    callback: (dp: BoundedPath) => void
) => {

    const { dbName, name, hasValue } = measurement

    console.log('Querying measurement: ', name, '\nTaskId: ', taskId );
    
    post( '/rides/ride', { tripId, dbName }, (boundedPath: BoundedPath) => {            
        
        const { path } = boundedPath;

        console.log("Got data for ride: ", taskId, "\nLength: ", path.length, '\nMeasurement: ', name, '\nHasValue?: ', hasValue ); 

        if ( path.length === 0 )
            return popup( {
                icon: "warning",
                title: `This trip doesn't contain data for ${name}`,
                footer: `TripId: ${tripId} | TaskId: ${taskId}`,
                toast: true
            } );

                    
        callback( boundedPath )
    })
}