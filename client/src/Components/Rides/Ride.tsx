import { FC, useState, useEffect } from "react";
import { LatLng } from 'leaflet'
import { Polyline, Circle } from 'react-leaflet'

import { RidePos, Measurements } from '../../assets/models'

import RoutingMachine from "../RoutingMachine";
import Path from "./Path";

import { post } from '../../assets/fetch'
import '../../css/road.css'

<<<<<<< HEAD
=======

>>>>>>> 9d67b1cab1a94b3897aa8376eff7deb315391551
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


const requests = [ '/ride', '/inter_ride' ]

const Ride: FC<Props> = ( { tripId, measurements, mapZoom } ) => {
    // array so that we can add other measurements
    const [isLoaded, setLoaded] = useState<boolean[]>([false, false])   // data has been fetched
    const [rides, setRides] = useState<RidePos[]>([[], []])             // full path from the db
    const [paths, setPaths] = useState<RidePos[]>([[], []])             // filtered path shown on map
        
    // TODO: use k nearest neighbor or something like this
    // measRide: the measurement ride we are updating
    // i: the position of the measurement ride in the measRides array
    const performancePath = (ride: RidePos, i: number): RidePos => {
        // first filter it to never show more then MAX_NB_POINTS
        const MAX_NB_POINTS = 2000
        const threshold: number = Math.floor(ride.length / MAX_NB_POINTS);
        const r: RidePos = ride.filter((_, i: number) => i % threshold === 0 );
        // console.log("r length after ", r.length);
        
        // const mappedZoom = (mapZoom <= 11) ? 0 : mapZoom - 11;
        // const maxLength = zooms[mappedZoom];
        // console.log("max length is", maxLength);
        
        const updatedPath: RidePos = [];        
        const batchSize: number = Math.max(16 - mapZoom, 1);
        for (let i = 0; i < r.length - 1; i += batchSize) {
            // const l = length(r[i], ride[i + 1]);            
            // if ( l < maxLength ) continue;
            updatedPath.push(r[i]);
        }

<<<<<<< HEAD
        console.log("before: ", r.length, "after: ", updatedPath.length);
=======
        // console.log("before: ", r.length, "after: ", updatedPath.length);
>>>>>>> 9d67b1cab1a94b3897aa8376eff7deb315391551
        return updatedPath
    }


    const requestMeasurement = (i: number) => {        
        post( requests[i], { tripID: tripId }, (data: any) => {
            setRides(  rides.map(    (ride: RidePos,   j: number) => i === j ? data : ride ));
            setPaths(  paths.map(    (p: RidePos,      j: number) => i === j ? performancePath(data, i) : p ));
            setLoaded( isLoaded.map( (loaded: boolean, j: number) => i === j ? true : loaded))     
            console.log("Got data for ride: ", tripId, ", length: ", data.length); 
        })
    }

    
    useEffect( () => {
        console.log(measurements);
        
        measurements
            .filter( m => m < 2 && !isLoaded[m] )  // dont take map matching into account and the ones that are already loaded 
            .forEach( m => requestMeasurement(m) ) // and request the rides
            
        console.log(isLoaded, rides, paths); 
    }, [measurements] );

    useEffect( () => 
        setPaths( paths.map( (p: RidePos, i: number) => performancePath(rides[i], i) ) )
    , [mapZoom] )
     

    /* ROUTING MACHINE TO GET THE MAP MATCHED */
    // <RoutingMachine path={path}></RoutingMachine>
    const rmPath: RidePos = []
    let l = Math.ceil(paths[1].length / 70)
    for (let i = 0; i < paths[1].length; i += l) 
    {
        rmPath.push(paths[1][i])        
    }
    
    
    return (<> 
        { 
        // paths.map( (path: RidePos, i: number) =>
        //     <Path path={path} zoom={mapZoom} measurement={i} key={`${tripId}-path-${i}`}></Path>
        // ) 
        }
         <RoutingMachine path={rmPath}></RoutingMachine>
        </>)
}

export default Ride;
