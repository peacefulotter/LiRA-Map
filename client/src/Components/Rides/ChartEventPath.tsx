
import React, { FC, useEffect, useState } from "react";
import { useChartCtx } from "../../context/ChartContext";
import { DataPath, PathProps } from "../../models/path";
import { RideMeasurement } from "../../models/properties";
import { post } from "../../queries/fetch";
import MetadataPath from "../Map/MetadataPath";
import Path from "../Map/Path";
import usePopup from "../Popup";

interface Props {
    tripId: string; 
    taskId: string;
    measurement: RideMeasurement;
}

const MemoizedEventPath: FC<PathProps> = React.memo<PathProps>( ( { dataPath, properties } ) => {
    return <MetadataPath dataPath={dataPath} properties={properties} />
} )


const ChartEventPath: FC<Props> = ( { tripId, taskId, measurement } ) => {

    const [dataPath, setDataPath] = useState<DataPath | undefined>(undefined)

    const { addChartData, remChartData } = useChartCtx()

    const popup = usePopup()

    useEffect( () => {

        const { query, queryMeasurement, name, hasValue } = measurement
        console.log('Querying measurement: ', name, '\ntaskId: ', Number(taskId) );
        
        post( query, { tripID: tripId, measurement: queryMeasurement }, (dataPath: DataPath) => {            
            
            const { path, minValue, maxValue, minTime, maxTime } = dataPath;

            console.log("Got data for ride: ", Number(taskId), "\nLength: ", path.length, '\nMeasurement: ', name, '\nHasValue?: ', hasValue ); 

            if ( path.length === 0 )
                return popup( {
                    icon: "warning",
                    title: `This trip doesn't contain data for ${name}`,
                    footer: `TripId: ${tripId} | TaskId: ${taskId}`
                } );

                        
            setDataPath( dataPath )
        
            // console.log("Min value", minValue, "Max Value", maxValue);
            // console.log("Min time", minTime, "Max Time", maxTime);

            if ( hasValue )
                addChartData( taskId, dataPath.path, dataPath.minTime )
        })

        return () => { dataPath !== undefined && measurement.hasValue && remChartData(taskId) }
    }, [measurement] )
    
    return dataPath !== undefined 
        ? <MemoizedEventPath dataPath={dataPath} properties={measurement} />
        : null
}

export default ChartEventPath;
