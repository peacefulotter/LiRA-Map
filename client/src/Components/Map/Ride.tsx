
import { FC, useState, useEffect } from "react";
import { useMapEvents } from 'react-leaflet'
import { LatLng } from 'leaflet'

import EventPath from "./EventPath";
import usePopup from '../Popup'

import { RideData, PathModel, ChartData, Measurement } from '../../assets/models'
import { post } from '../../assets/fetch'

import '../../css/road.css'

const getEmptyPath = (): PathModel => {
    return {
        loaded: false,
        path: { data: [] },
        fullPath: undefined,
    }
}

const ZOOMS: {[key: number]: number}= {
    12: 3_000,
    13: 5_000,
    14: 30_000,
    15: 35_000,
    16: 30_000,
}

interface Request {
    type: string;
    minLength: number;
    bounds: object;
}

interface Props {
    measurements: Measurement[], 
    activeMeasurements: number[], 
    tripId: string, 
    taskId: number, 
    addChartData: (dataName: string, data: ChartData) => void,
    removeChartData: (dataName: string) => void
}
 
const Ride: FC<Props> = ( { measurements, activeMeasurements, tripId, taskId, addChartData, removeChartData } ) => {
    
    const [paths, setPaths] = useState<PathModel[]>(measurements.map(getEmptyPath))  
    const [request, setRequest] = useState<Request | undefined>(undefined)

    const popup = usePopup()
    
    const map = useMapEvents({
        zoom: (e: any) => {
            pushRequestForAll()
        },
        dragend: (e: any) => {            
            pushRequestForAll()
        }
    })

    const worker = new Worker('/thread.worker.js');    

    const submitWork = (type: string, minLength: number, bounds: object, paths: PathModel[] | undefined, path: RideData | undefined, i: number | undefined ) => {
        worker.postMessage( { type: type, minLength: minLength, bounds: bounds, paths: paths, path: path, i: i } );
    }

    const pushRequest = (type: string, paths: PathModel[] | undefined, path: RideData | undefined, i: number | undefined ) => {
        const req: Request = { type: type, minLength: getMinLength(), bounds: getMapBounds() }
        
        if ( request === undefined )
            submitWork(req.type, req.minLength, req.bounds, paths, path, i)
        else
        {
            setRequest(req)
            console.log('Queue request');
        }
    }

    const pushRequestForOne = (path: RideData, i: number) => {
        pushRequest( 'ONE', undefined, path, i )
    }

    const pushRequestForAll = () => {
        pushRequest( 'ALL', [...paths], undefined, undefined )
    }
    
    const getMapBounds = () => {
        const bounds = map.getBounds();
        return [bounds.getNorthWest(), bounds.getSouthEast()]
    }
    
    const getMinLength = () => {
        const [northWest, southEast] = getMapBounds();
    
        let deltaLat = northWest.lat - southEast.lat
        let deltaLng = southEast.lng - northWest.lng;
        const mappedZoom = Math.min(Math.max(map.getZoom(), 12), 16)
        const precision = ZOOMS[mappedZoom];
        
        return Math.sqrt( deltaLat * deltaLat + deltaLng * deltaLng ) / precision;
    }


    
    const getDataName = (measurement: Measurement): string => {
        return taskId.toString()
    }

    useEffect(() => {      
        worker.onmessage = ( { data: { type, pathsCopy, path, performancePath, index } }: any ) => {
            if ( type === 'ONE' )
            {                
                const pathsCp = [...paths]
                const newPath: PathModel = {
                    loaded: true,
                    path: performancePath,
                    fullPath: path
                }

                if ( index < paths.length )
                    pathsCp[index] = newPath
                else
                    pathsCp.push( newPath )

                setPaths(pathsCp)
            }
            else if ( type === 'ALL') {
                setPaths(pathsCopy);
            }

            if ( request )
            {                
                if ( request.type === 'ONE' )
                    submitWork(request.type, request.minLength, request.bounds, undefined, undefined, undefined )
                else if ( request.type === 'ALL' )
                    submitWork(request.type, request.minLength, request.bounds, [...paths], undefined, undefined )
            }
        };
    }, [worker]);

    const requestMeasurement = ( measIndex: number ) => {     
        if ( paths[measIndex] !== undefined && paths[measIndex].loaded ) return;

        const meas: Measurement = measurements[measIndex]
        
        post( meas.query, { tripID: tripId, measurement: meas.queryMeasurement }, (res: any) => {            
            const latLngData = res.data.map( (d: any) => { 
                return { pos: new LatLng(d.pos.lat, d.pos.lon), value: d.value, timestamp: d.timestamp } 
            } )
            const { minValue, maxValue, minTime, maxTime } = res;
            const path: RideData = { data: latLngData, minValue, maxValue, minTime, maxTime }
            
            pushRequestForOne( path, measIndex )

            console.log("Got data for ride: ", tripId, ", length: ", latLngData.length); 
            console.log("Min value", minValue, "Max Value", maxValue);
            console.log("Min time", minTime, "Max Time", maxTime);

            if ( meas.value )
            {
                if ( path.data.length === 0 )
                    return popup({
                        icon: "warning",
                        title: `This trip doesn't contain data for ${meas.name}`,
                        footer: `TripId: ${tripId} | TaskId: ${taskId}`
                    } );

                const min = path.data[0].timestamp || 0                
                addChartData( getDataName(meas), res.data.map( (d: any) => { 
                    return { x: d.timestamp as number - min, y: d.value as number } 
                } ) )
            }
        })
    }

    
    useEffect( () => {    
        // when adding a new measurement                
        if ( measurements.length > paths.length )
            requestMeasurement(paths.length)
                  
        paths.forEach( (p: any, k: number) => {
            const include = activeMeasurements.includes(k)
            
            // load
            if ( include && !paths[k].loaded )
                requestMeasurement(k)
                
            // unload
            else if ( !include && paths[k].loaded )
            {
                const pathsCopy: any = [...paths]
                pathsCopy[k].loaded = false;
                pathsCopy[k].path = undefined;
                pathsCopy[k].fullPath = undefined;
                setPaths(pathsCopy)

                removeChartData( getDataName(measurements[k]) )
            }
        })        
    }, [measurements, activeMeasurements, paths] );


    return (
        <>
        {
            paths
            .filter( p => p.loaded )
            .map( (p,i) => 
                <EventPath 
                    key={`path${Math.random()}`} 
                    path={p.path} 
                    properties={measurements[activeMeasurements[i]]}/> 
            )
        }
        </>
    )
}

export default Ride;