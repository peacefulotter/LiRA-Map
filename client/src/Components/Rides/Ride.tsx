import { FC, useState, useEffect } from "react";
import { useMapEvents } from 'react-leaflet'
import { LatLng } from 'leaflet'

import { Measurements, MEASUREMENTS, RideData } from '../../assets/models'

import RoutingMachine from "../RoutingMachine";
import Path from "./Path";

import { post } from '../../assets/fetch'
import '../../css/road.css'


type Props = {
	tripId: string;
    taskId: number; 
    measKeys: (keyof Measurements)[];
    mapZoom: number;
    updateChart: (addData: boolean, dataName: string, data: number[]) => void;
};

type Ride = {
    measurement: keyof Measurements
}

const Ride: FC<Props> = ( { tripId, taskId, measKeys, mapZoom, updateChart } ) => {
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
    
    const requestMeasurement = (measurement: keyof Measurements) => {     
        if ( paths[measurement].loaded ) return;

        const meas = MEASUREMENTS[measurement]

        post( meas.query, { tripID: tripId }, (res: RideData) => {
            const data = res.map( d => { return { pos: new LatLng(d.pos.lat, d.pos.lng), value: d.value } } )
            
            const pathsCopy: any = {...paths}
            pathsCopy[measurement].loaded = true;
            pathsCopy[measurement].path = data;
            setPaths(pathsCopy)

            if ( meas.value )
                updateChart(true, meas.name + '-' + taskId, res.map( d => d.value as number ) )
            
            console.log("Got data for ride: ", tripId, ", length: ", res.length); 
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