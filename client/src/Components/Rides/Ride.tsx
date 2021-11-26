import { FC, useState, useEffect } from "react";
import { LatLng } from 'leaflet'
import { Polyline, Circle } from 'react-leaflet'

import { RidePos, Measurements, PointData, RideData, MeasurementProperties } from '../../assets/models'

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
    measurements: Measurements[];
    mapZoom: number;
};

const Ride: FC<Props> = ( { tripId, measurements, mapZoom } ) => {
    // array so that we can add other measurements
    const [isLoaded, setLoaded] = useState<boolean[]>([false, false])       // data has been fetched
    const [rides, setRides] = useState<RideData[]>(Array.from({length: 4})) // full path from the db
    const [paths, setPaths] = useState<RideData[]>(Array.from({length: 4})) // filtered path shown on map
        
    // TODO: use k nearest neighbor or something like this
    // measRide: the measurement ride we are updating
    // i: the position of the measurement ride in the measRides array
    const performancePath = (ride: RideData, i: number): RideData => {
        console.log(ride, i);
        
        if ( ride === undefined ) return [];
        
        // first filter it to never show more then MAX_NB_POINTS
        const MAX_NB_POINTS = 2000
        const threshold: number = Math.floor(ride.length / MAX_NB_POINTS);
        const r: RideData = ride.filter((_, i: number) => i % threshold === 0 );
        // console.log("r length after ", r.length);
        
        // const mappedZoom = (mapZoom <= 11) ? 0 : mapZoom - 11;
        // const maxLength = zooms[mappedZoom];
        // console.log("max length is", maxLength);
        
        const updatedPath: RideData = [];        
        const batchSize: number = Math.max(16 - mapZoom, 1);
        for (let i = 0; i < r.length - 2; i += batchSize) 
        {
            const average: number[] = [0, 0];

            for (let j = 0; j < batchSize; j++) 
            {
                if ( r[i + j] === undefined ) continue;    
                average[0] += r[i + j].pos.lat;                
                average[1] += r[i + j].pos.lng;                
            }
            // const l = length(r[i], ride[i + 1]);            
            // if ( l < maxLength ) continue;
            const lat = average[0] / batchSize;
            const lng = average[1] / batchSize;

            updatedPath.push({
                pos: new LatLng(lat, lng),
                value: ride[i].value        // copy value
            });
        }

        // console.log("before: ", r.length, "after: ", updatedPath.length);
        return updatedPath
    }


    const requestMeasurement = (i: number) => {                
        post( MeasurementProperties[i].query, { tripID: tripId }, (res: RideData) => {
            const data = res.map( d => { return { pos: new LatLng(d.pos.lat, d.pos.lng), value: d.value } } )
            setRides(  rides.map(    (ride: RideData,   j: number) => i === j ? data : ride ));
            setPaths(  paths.map(    (path: RideData,   j: number) => i === j ? data : path )); // performancePath(res, i)
            setLoaded( isLoaded.map( (loaded: boolean,  j: number) => i === j ? true : loaded))  
            console.log(res);
            console.log(data);
            
            console.log("Got data for ride: ", tripId, ", length: ", res.length); 
        })
    }

    
    useEffect( () => {
        console.log(measurements);
        
        measurements
            .filter( m => m != 2 && !isLoaded[m] ) // dont take map matching into account and the ones that are already loaded 
            .forEach( m => requestMeasurement(m) ) // and request the rides
            
        console.log(isLoaded, rides, paths); 
    }, [measurements] );

    useEffect( () => 
        setPaths( paths.map( (p: RideData, i: number) => performancePath(rides[i], i) ) )
    , [mapZoom] )
     

    /* ROUTING MACHINE TO GET THE MAP MATCHED */
    // <RoutingMachine path={path}></RoutingMachine>
    
    return (<> 
        { 
        paths.map( (path: RideData, i: number) =>
            ( path === undefined || path.length === 0 ) ? <></> :
            <Path path={path} zoom={mapZoom} measurement={i} key={`${tripId}-path-${i}`}></Path>
        ) 
        }
        { 
        // <RoutingMachine path={rmPath}></RoutingMachine> 
        }
        </>)
}

export default Ride;