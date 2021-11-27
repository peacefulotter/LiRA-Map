import { FC, useState, useEffect } from "react";
import { LatLng } from 'leaflet'

import { Measurements, MEASUREMENTS, RideData } from '../../assets/models'

import RoutingMachine from "../RoutingMachine";
import Path from "./Path";

import { post } from '../../assets/fetch'
import '../../css/road.css'

const zooms = [
    0.05,  // <= 11
    0.003,   // 12
    0.001,  // 13
    0.001,  // 14
    0.001,  // 15
    0.0005,  // 16
    0.0001,  // 17
    0.0     // 18 (max)
]

const length = (a: LatLng, b: LatLng): number => {
    let delta = [a.lat - b.lat, a.lng - b.lng];
    return Math.sqrt( delta[0] * delta[0] + delta[1] * delta[1] )
}

type Props = {
	tripId: string;
    measKeys: (keyof Measurements)[];
    mapZoom: number;
};

type Ride = {
    measurement: keyof Measurements
}

const Ride: FC<Props> = ( { tripId, measKeys, mapZoom } ) => {
    // TODO: define types for the state
    const [paths, setPaths] = useState<any>( (function()  {
        const keys = Object.keys(MEASUREMENTS)
        const res: {[key: string]: any} = {}
        for ( const i in keys )
        {
            res[keys[i]] = {
                loaded: false,
                ride: null,
                path: null
            }
        }
        return res;
    } )())  
    
    console.log(tripId, paths);
    
            
    // TODO: use k nearest neighbor or something like this
    const performancePath = (ride: RideData): RideData => {        
        if ( ride === null || ride === undefined ) return [];
        
        // first filter it to never show more then MAX_NB_POINTS
        const MAX_NB_POINTS = 2000
        const threshold: number = Math.max(Math.floor(ride.length / MAX_NB_POINTS), 1)        
        const r: RideData = ride.filter((_, i: number) => i % threshold === 0 );
        // console.log("r length after ", r.length);
        
        // const mappedZoom = (mapZoom <= 11) ? 0 : mapZoom - 11;
        // const maxLength = zooms[mappedZoom];
        // console.log("max length is", maxLength);
        
        const updatedPath: RideData = [];        
        const batchSize: number = Math.max(16 - mapZoom, 1);
        for (let i = 0; i < r.length - 2; i += batchSize) 
        {
            const average: number[] = [0, 0, 0];
            const portion = i + batchSize <= r.length - 1 ? batchSize : r.length - i            

            for (let j = 0; j < portion; j++) 
            {
                average[0] += r[i + j].pos.lat;                
                average[1] += r[i + j].pos.lng;                
                average[2] += r[i + j].value || 0;                
            }
            // const l = length(r[i], ride[i + 1]);            
            // if ( l < maxLength ) continue;
            const lat = average[0] / portion;
            const lng = average[1] / portion;
            const val = average[2] / portion;                        
            
            updatedPath.push({
                pos: new LatLng(lat, lng),
                value: val
            });
        }
        
        console.log("before:", r.length, " after:", updatedPath.length);
        return updatedPath
    }


    const requestMeasurement = (measurement: keyof Measurements) => {     
        if ( paths[measurement].loaded ) return;

        post( MEASUREMENTS[measurement].query, { tripID: tripId }, (res: RideData) => {
            const data = res.map( d => { return { pos: new LatLng(d.pos.lat, d.pos.lng), value: d.value } } )
            
            const pathsCopy: any = {...paths}
            pathsCopy[measurement].loaded = true;
            pathsCopy[measurement].ride = data;
            pathsCopy[measurement].path = performancePath(data);
            setPaths(pathsCopy)
            
            console.log("Got data for ride: ", tripId, ", length: ", res.length); 
        })
    }

    
    useEffect( () => {
        measKeys.forEach( m => requestMeasurement(m) )
    }, [measKeys] );

    useEffect( () => {
        const updatedPaths: any = {...paths}
        Object.keys(paths).forEach( (key: string) => {
            if ( paths[key].loaded )
                updatedPaths[key].path = performancePath(paths[key].ride)
        })
        setPaths( updatedPaths )
    }, [mapZoom] )
     

    /* ROUTING MACHINE TO GET THE MAP MATCHED */
    // <RoutingMachine path={path}></RoutingMachine>
    
    return (<> 
        { 
        Object.keys(paths).map( (key: string, i: number) => 
            ( !paths[key].loaded ) 
                ? <div key={`${tripId}-path-${i}`}></div> 
                : <Path 
                path={paths[key].path} 
                zoom={mapZoom} 
                measurement={key as keyof Measurements} 
                key={`${tripId}-path-${i}`}></Path>     
        )
        }
        {/* { <RoutingMachine path={rmPath}></RoutingMachine>  } */}
        </>)
}

export default Ride;