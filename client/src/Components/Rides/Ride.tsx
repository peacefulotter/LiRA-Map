import { FC, useState, useEffect } from "react";
import { useMapEvents } from 'react-leaflet'
import { LatLng } from 'leaflet'

import { Measurements, MEASUREMENTS, MeasurementProperty, RideData } from '../../assets/models'
import { ChartData } from './useChart';

import RoutingMachine from "../RoutingMachine";
import Path from "./Path";

import { post } from '../../assets/fetch'
import '../../css/road.css'
import { group } from "console";


type Props = {
	tripId: string;
    taskId: number; 
    measKeys: (keyof Measurements)[];
    mapZoom: number;
    addChartData: (dataName: string, data: ChartData) => void;
    removeChartData: (dataName: string) => void;
};

type Ride = {
    measurement: keyof Measurements
}

const Ride: FC<Props> = ( { tripId, taskId, measKeys, mapZoom, addChartData, removeChartData } ) => {
    // TODO: define types for the state
    const [paths, setPaths] = useState<any>( (function()  {
        const keys = Object.keys(MEASUREMENTS)
        const res: {[key: string]: any} = {}
        for ( const i in keys )
        {
            res[keys[i]] = {
                loaded: false,
                path: null
            }
        }
        return res;
    } )())   
    
    const map = useMapEvents({})
    
    const getDataName = (measurement: MeasurementProperty): string => {
        return measurement.name + '-' + taskId
    }
    
    const requestMeasurement = (measurement: keyof Measurements) => {     
        if ( paths[measurement].loaded ) return;

        const meas: MeasurementProperty = MEASUREMENTS[measurement]

        post( meas.query, { tripID: tripId }, (res: any) => {
            const latLngData = res.data.map( (d: any) => { 
                return { pos: new LatLng(d.pos.lat, d.pos.lon), value: d.value, timestamp: d.timestamp } 
            } )
            const path = { data: latLngData, minValue: res.minValue, maxValue: res.maxValue, minTime: res.minTime, maxTime: res.maxTime }
            
            const pathsCopy: any = {...paths}
            pathsCopy[measurement].loaded = true;
            pathsCopy[measurement].path = path;
            setPaths(pathsCopy)

            if ( meas.value )
            {
                const min = path.data[0].timestamp || 0
                addChartData( getDataName(meas), res.data.map( (d: any) => { 
                    return { x: d.timestamp as number - min, y: d.value as number } 
                } ) )
            }
                
            console.log("Got data for ride: ", tripId, ", length: ", path.data.length); 
            console.log("Min value", path.minValue, "Max Value", path.maxValue);
            console.log("Min time", path.minTime, "Max Time", path.maxTime);
        })
    }

    
    useEffect( () => {
        Object.keys(paths).forEach( (key: string) => {
            const k = key as keyof Measurements;
            const include = measKeys.includes(k)
            // load
            if ( include && !paths[k].loaded )
                requestMeasurement(k)
                
            // unload
            else if ( !include && paths[k].loaded )
            {
                const pathsCopy: any = {...paths}
                pathsCopy[k].loaded = false;
                pathsCopy[k].path = undefined;
                setPaths(pathsCopy)

                removeChartData( getDataName(MEASUREMENTS[k]) )
            }
        })        
    }, [measKeys] );


    return (<> 
        {
        Object.keys(paths).map( (key: string, i: number) => 
            ( !paths[key].loaded ) 
                ? <div key={`${tripId}-path-${i}`}></div> 
                : <Path 
                path={paths[key].path} 
                zoom={mapZoom} 
                measurement={key as keyof Measurements} 
                map={map}
                key={`${tripId}-path-${i}`}></Path>     
        )
        }
        {/* { <RoutingMachine path={rmPath}></RoutingMachine> } */}
        </>)
}

export default Ride;