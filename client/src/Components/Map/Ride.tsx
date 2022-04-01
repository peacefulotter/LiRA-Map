
import { FC, useState, useEffect } from "react";

import EventPath from "./EventPath";
import usePopup from '../Popup'

import { DataPath, Measurement, Path } from '../../models/models'

import '../../css/road.css'
import { useMeasurementsCtx } from "../../context/MeasurementsContext";
import { post } from "../../queries/fetch";



interface Props {
    tripId: string, 
    taskId: number, 
    addChartData: (dataName: string, path: Path, minTime?: number) => void,
    removeChartData: (dataName: string) => void
}

interface LoadablePath {
    displayed: boolean;
    dataPath: DataPath | undefined
}

const getEmptyLoadablePath = () => {
    return { displayed: false, dataPath: undefined }
}
 
const Ride: FC<Props> = ( { tripId, taskId, addChartData, removeChartData } ) => {
    
    const { measurements } = useMeasurementsCtx()
    
    const [paths, setPaths] = useState<LoadablePath[]>(
        measurements.map(getEmptyLoadablePath)
    )  
    const popup = usePopup()

    const getDataName = (measurement: Measurement): string => {
        return taskId.toString()
    }

    const requestMeasurement = ( measIndex: number ) => {     
        if ( paths[measIndex] !== undefined && paths[measIndex].dataPath !== undefined ) 
            return;

        const meas: Measurement = measurements[measIndex]
        const { query, queryMeasurement, hasValue, name }: Measurement = meas
        
        post( query, { tripID: tripId, measurement: queryMeasurement }, (data: DataPath) => {            
            
            console.log(data);
            const { path, minValue, maxValue, minTime, maxTime } = data;
            
            const temp = [...paths]
            temp[measIndex].dataPath = data;
            temp[measIndex].displayed = true;
            setPaths(temp)
            
            console.log("Got data for ride: ", tripId, ", length: ", path.length); 
            console.log("Min value", minValue, "Max Value", maxValue);
            console.log("Min time", minTime, "Max Time", maxTime);

            if ( path.length === 0 )
                return popup( {
                    icon: "warning",
                    title: `This trip doesn't contain data for ${name}`,
                    footer: `TripId: ${tripId} | TaskId: ${taskId}`
                } );

            if ( hasValue )
                addChartData( getDataName(meas), path, minTime || 0 )
        })
    }

    
    useEffect( () => { 
        // when adding a new measurement                
        if ( measurements.length > paths.length )
            requestMeasurement(paths.length)

        paths.forEach( (p: LoadablePath, i: number) => {
            const meas = measurements[i]

            console.log(i, meas.isActive, p.displayed);
            

            // load and show
            if ( meas.isActive && p.dataPath === undefined )
                requestMeasurement(i)

            // show without loading it again since it's already loaded
            else if ( meas.isActive && p.dataPath !== undefined && !p.displayed )
            {
                const temp = [...paths]
                temp[i].displayed = true;
                setPaths(temp)

                addChartData( getDataName(meas), p.dataPath.path, p.dataPath.minTime )
            }
            // hide but keep in memory 
            else if ( !meas.isActive && p.displayed )
            {
                const temp: any = [...paths]
                temp[i].displayed = false;
                setPaths(temp)

                removeChartData( getDataName(meas) )
            }
        })        
    }, [measurements] );


    return (
        <>
        { paths.map( (p: LoadablePath, i: number) => 
            measurements[i].isActive && p.displayed && p.dataPath !== undefined 
                ? <EventPath 
                    key={`path${Math.random()}`} 
                    dataPath={p.dataPath} 
                    properties={measurements[i]}/>
                : null
                     
        ) }
        </>
    )
}

export default Ride;