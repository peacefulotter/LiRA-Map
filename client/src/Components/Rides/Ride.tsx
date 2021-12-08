import { FC, useState, useEffect } from "react";
import { useMapEvents } from 'react-leaflet'
import { LatLng } from 'leaflet'

import { RideData, PointData } from '../../assets/models'
import { Measurement } from './Measurements'
import usePopup from '../Popup'
import { ChartData } from './useChart';

import Path from "./Path";

import { post } from '../../assets/fetch'
import '../../css/road.css'
import { request } from "https";


type Props = {
    measurements: Measurement[];
    activeMeasurements: number[];
	tripId: string;
    taskId: number; 
    mapZoom: number;
    addChartData: (dataName: string, data: ChartData) => void;
    removeChartData: (dataName: string) => void;
};

type Path = {
    loaded: boolean;
    path: RideData | undefined
    fullPath: RideData | undefined
}

const ZOOMS: { [key: number]: number } = {
    12: 3_000,
    13: 5_000,
    14: 10_000,
    15: 15_000,
    16: 30_000,
}

const getEmptyPath = (): Path => {
    return {
        loaded: false,
        path: undefined,
        fullPath: undefined,
    }
}

const Ride: FC<Props> = ( { measurements, activeMeasurements, tripId, taskId, mapZoom, addChartData, removeChartData } ) => {
    const [paths, setPaths] = useState<Path[]>(
        measurements.map(getEmptyPath)
    )  

    const popup = usePopup()
    
    const map = useMapEvents({
        zoom: (e: any) => {
            console.log(map.getZoom());            
            calcPerformancePaths()
        },
        dragend: (e: any) => {
            calcPerformancePaths()
        }
    })

    const getMapBounds = () => {
        const bounds = map.getBounds();
        return [bounds.getNorthWest(), bounds.getSouthEast()]
    }

    const getMinLength = () => {
        const [northWest, southEast] = getMapBounds();

        let deltaLat = northWest.lat - southEast.lat
        let deltaLng = southEast.lng - northWest.lng
        const mappedZoom = Math.min(Math.max(map.getZoom(), 12), 16)
        const precision = ZOOMS[mappedZoom];
        console.log(precision);
        
        return Math.sqrt( deltaLat * deltaLat + deltaLng * deltaLng ) / precision;
    }

    const outOfBounds = (point: PointData): boolean => {
        const [northWest, southEast] = getMapBounds();
        const p = point.pos;
        return p.lat > northWest.lat || p.lng < northWest.lng || p.lat < southEast.lat || p.lng > southEast.lng
    }

    const getPerformancePath = (path: RideData, precisionLength: number): RideData => {
        const NB_POINTS_THRESHOLD = 1_000;
        if ( path.data.length <= NB_POINTS_THRESHOLD )
             return path;

        let currentPoint: PointData = path.data[0]
        const updated: PointData[] = [currentPoint]
        let oob = false;

        for (let i = 1; i < path.data.length; i++) 
        {
            const point = path.data[i]
            const distLat = point.pos.lat - currentPoint.pos.lat; 
            const distLng = point.pos.lng - currentPoint.pos.lng; 
            const length = Math.sqrt( distLat * distLat + distLng * distLng )
            if ( outOfBounds(point) )
            {
                if ( !oob )
                {
                    updated.push(point)
                    oob = true;
                }
                
                currentPoint = point;                
            }
            else if ( length <= precisionLength )
                oob = false
            else if ( length > precisionLength )
            {
                if ( oob )
                    updated.push(path.data[i - 1])
                oob = false

                currentPoint = point;
                updated.push(point)
            }
                
        }

        console.log(path.data.length, updated.length);
        return { data: updated, minValue: path.minValue, maxValue: path.maxValue, minTime: path.minTime, maxTime: path.maxTime };
    }


    const calcPerformancePaths = () => {
        const precisionLength = getMinLength()

        const pathsCopy: any = [...paths]        

        paths.forEach( (p: any, k: number) => {
            if ( !p.loaded || p.fullPath === undefined )
                return;
            const performancePath: RideData = getPerformancePath(p.fullPath, precisionLength)
            pathsCopy[k].path = performancePath;
        } )

        setPaths(pathsCopy)
    }
    

    const getDataName = (measurement: Measurement): string => {
        return taskId.toString()
    }
    
    const requestMeasurement = (pathsCopy: any[], measIndex: number) => {     
        if ( paths[measIndex] !== undefined && paths[measIndex].loaded ) return;

        const meas: Measurement = measurements[measIndex]
        
        post( meas.query, { tripID: tripId, measurement: meas.queryMeasurement }, (res: any) => {
            console.log(res);
            
            const latLngData = res.data.map( (d: any) => { 
                return { pos: new LatLng(d.pos.lat, d.pos.lon), value: d.value, timestamp: d.timestamp } 
            } )
            const path: RideData = { data: latLngData, minValue: res.minValue, maxValue: res.maxValue, minTime: res.minTime, maxTime: res.maxTime }
            
            const precisionLength = getMinLength()
            const performancePath = getPerformancePath(path, precisionLength)
            
            pathsCopy[measIndex].loaded = true;
            pathsCopy[measIndex].path = performancePath;
            pathsCopy[measIndex].fullPath = path;

            setPaths(pathsCopy)

            console.log("Got data for ride: ", tripId, ", length: ", path.data.length); 
            console.log("Min value", path.minValue, "Max Value", path.maxValue);
            console.log("Min time", path.minTime, "Max Time", path.maxTime);

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
        console.log(measurements.length, paths.length);
        
        if ( measurements.length > paths.length )
            requestMeasurement([...paths, getEmptyPath()], paths.length)
                  
        paths.forEach( (p: any, k: number) => {
            const include = activeMeasurements.includes(k)
            // load
            if ( include && !paths[k].loaded )
                requestMeasurement([...paths], k)
                
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
    }, [activeMeasurements] );


    return (<> 
        {
        paths.map( (p: any, i: number) => 
            ( !p.loaded ) 
                ? <div key={`${tripId}-path-${i}`}></div> 
                : <Path 
                    path={p.path} 
                    zoom={mapZoom} 
                    properties={measurements[i]} 
                    map={map}
                    key={`${tripId}-path-${i}`}></Path>     
        )
        }
        {/* { <RoutingMachine path={rmPath}></RoutingMachine> } */}
        </>)
}

export default Ride;