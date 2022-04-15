
import { FC, useEffect, useState } from "react";
import { DataPath } from "../../models/path";
import { RideMeasurement } from "../../models/properties";
import { post } from "../../queries/fetch";
import MetadataPath from "../Map/MetadataPath";
import usePopup from "../Popup";

interface Props {
    tripId: string; 
    taskId: string;
    measurement: RideMeasurement;
}

const GraphEventPath: FC<Props> = ( { tripId, taskId, measurement } ) => {

    const [dataPath, setDataPath] = useState<DataPath | undefined>(undefined)

    const popup = usePopup()

    useEffect( () => {

        const { query, queryMeasurement, name, hasValue } = measurement
        console.log('Querying measurement: ', name, '\ntaskId: ', Number(taskId) );
        
        post( query, { tripID: tripId, measurement: queryMeasurement }, (dataPath: DataPath) => {            
            
            const { path } = dataPath;

            console.log("Got data for ride: ", Number(taskId), "\nLength: ", path.length, '\nMeasurement: ', name, '\nHasValue?: ', hasValue ); 

            if ( path.length === 0 )
                return popup( {
                    icon: "warning",
                    title: `This trip doesn't contain data for ${name}`,
                    footer: `TripId: ${tripId} | TaskId: ${taskId}`
                } );

                        
            setDataPath( dataPath )
        
            // console.log(minX, maxX, minY, maxY);
        })
        
    }, [measurement] )
    
    return dataPath !== undefined 
        ? <MetadataPath dataPath={dataPath} properties={measurement} />
        : null
}

export default GraphEventPath;
