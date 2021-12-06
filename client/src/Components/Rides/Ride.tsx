import { FC, useState, useEffect } from "react";
import { useMapEvents } from 'react-leaflet'
import { LatLng } from 'leaflet'

import { RideData, PointData } from '../../assets/models'
import { Measurements, Measurement } from '../../assets/measurements'
import usePopup from '../Popup'
import { ChartData } from './useChart';

import Path from "./Path";

import { post } from '../../assets/fetch'
import '../../css/road.css'


type Props = {
	tripId: string;
    taskId: number; 
    mapZoom: number;
    measIndices: number[];
    addChartData: (dataName: string, data: ChartData) => void;
    removeChartData: (dataName: string) => void;
};

type Path = {
    loaded: boolean;
    path: RideData | undefined
    fullPath: RideData | undefined
}

const Ride: FC<Props> = ( { tripId, taskId, measIndices, mapZoom, addChartData, removeChartData } ) => {
    // TODO: define types for the state
    const [paths, setPaths] = useState<Path[]>(
        Measurements.map((m: Measurement) => {
            return {
                loaded: false,
                path: undefined,
                fullPath: undefined,
            }
        })
    )    

    const popup = usePopup()
    
    const map = useMapEvents({
        zoom: (e: any) => {
            console.log(map.getZoom());
            calcPerformancePath()
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
        const PRECISION = 1000;
        return Math.sqrt( deltaLat * deltaLat + deltaLng * deltaLng ) / PRECISION;
    }

    const outOfBounds = (point: PointData): boolean => {
        const [northWest, southEast] = getMapBounds();
        const p = point.pos;
        return p.lat < northWest.lat || p.lng < northWest.lng || p.lat > southEast.lat || p.lng > southEast.lng
    }

    const getPerformancePath = (path: RideData, precisionLength: number): RideData => {
        const NB_POINTS_THRESHOLD = 10_000;
        if ( path.data.length <= NB_POINTS_THRESHOLD )
            return path;

        let currentPoint: PointData = path.data[0]
        const updated: PointData[] = [currentPoint]

        for (let i = 1; i < path.data.length; i++) 
        {
            const point = path.data[i]
            const distLat = point.pos.lat - currentPoint.pos.lat; 
            const distLng = point.pos.lng - currentPoint.pos.lng; 
            const length = Math.sqrt( distLat * distLat + distLng * distLng )

            if ( outOfBounds(point) )
                currentPoint = point;
            else if ( length > precisionLength )
            {
                currentPoint = point;
                updated.push(point)
            }
                
        }

        console.log(path.data.length, updated.length);
        return { data: updated, minValue: path.minValue, maxValue: path.maxValue, minTime: path.minTime, maxTime: path.maxTime };
    }


    const calcPerformancePath = () => {
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
    
    const requestMeasurement = (measIndex: number) => {     
        if ( paths[measIndex].loaded ) return;

        const meas: Measurement = Measurements[measIndex]
        
        post( meas.query, { tripID: tripId, measurement: meas.queryMeasurement }, (res: any) => {
            console.log(res);
            
            const latLngData = res.data.map( (d: any) => { 
                return { pos: new LatLng(d.pos.lat, d.pos.lon), value: d.value, timestamp: d.timestamp } 
            } )
            const path: RideData = { data: latLngData, minValue: res.minValue, maxValue: res.maxValue, minTime: res.minTime, maxTime: res.maxTime }
            
            const pathsCopy: any = [...paths]
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
        paths.forEach( (p: any, k: number) => {
            const include = measIndices.includes(k)
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

                removeChartData( getDataName(Measurements[k]) )
            }
        })        
    }, [measIndices] );


    return (<> 
        {
        paths.map( (p: any, i: number) => 
            ( !p.loaded ) 
                ? <div key={`${tripId}-path-${i}`}></div> 
                : <Path 
                    path={p.path} 
                    zoom={mapZoom} 
                    measIndex={i} 
                    map={map}
                    key={`${tripId}-path-${i}`}></Path>     
        )
        }
        {/* { <RoutingMachine path={rmPath}></RoutingMachine> } */}
        </>)
}

export default Ride;