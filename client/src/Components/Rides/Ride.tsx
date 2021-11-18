import { FC, useState, useEffect, useRef } from "react";
import { LatLng } from 'leaflet'
import { Polyline, Circle } from 'react-leaflet'

import { RidePos, RideMeta, Measurements } from '../../assets/models'

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

type MeasurementManagement = {
    m: Measurements;
    isAdded: boolean;
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
    const performancePath = (i: number) => {
        if ( !isLoaded[i] ) return;

        // first filter it to never show more then MAX_NB_POINTS
        const MAX_NB_POINTS = 2000
        const threshold = Math.floor(rides[i].length / MAX_NB_POINTS);
        console.log("threshold for filter", threshold);
        const r = rides[i].filter((r: LatLng, i: number) => i % threshold === 0 );
        console.log("r length after ", r.length);
        

        console.log("starting filter with zoom", mapZoom);
        let mappedZoom = (mapZoom <= 11) ? 0 : mapZoom - 11;
        let maxLength = zooms[mappedZoom];
        console.log("max length is", maxLength);
        
        let updatedPath = [];        
        let batchSize = Math.max(16 - mapZoom, 1);
        for (let i = 0; i < r.length - 1; i += batchSize) {
            // const l = length(r[i], ride[i + 1]);            
            // if ( l < maxLength ) continue;
            updatedPath.push(r[i]);
        }

        console.log("before: ", r.length, "after: ", updatedPath.length);
        // setMeasRide(updated);
    }


    const requestMeasurement = (i: number) => {
        const path = requests[i]        

        post(path, {tripID: tripId}, (data: any) => {
            // setRide(data);
            // performancePath();
            console.log("Got data for ride: ", tripId, ", length: ", data.length);      
        })
    }

    
    useEffect( () => {
        const toLoad = measurements
            .filter(m => m < 2)         // dont take map matching into account 
            .map( m => isLoaded[m] );   // get if the data is loaded already or not
        console.log(toLoad);
        toLoad
            .filter( (elt: boolean) => elt ) // keep only the ones that we have to load
            .forEach((elt: boolean, i: number) => requestMeasurement(i)) // and request them

        // if ( !newMeasurement.isAdded )
        // {
        //     // setRide([])
        //     // setPath([])
        //     return;
        // }
        // else if ( newMeasurement.m === Measurements.Map_Match )
        // {
        //     console.log('USE MAP MATCH TODO');
        //     return;
        // }

        // requestMeasurement(newMeasurement.m);
        
    }, [measurements] );

    // useEffect( performancePath, [ride, mapZoom] )
    

    /* FOR THE LINES */
    // let groupedPos = []
    // for (let i = 0; i < path.length - 2; i++) {
    //     groupedPos.push([path[i], path[i+1]])
    // }

    // { 
	// 	groupedPos.map( (pos: LatLng[], i: number) => {	
    //      return <Polyline positions={[ [pos[0].lat, pos[0].lng], [pos[1].lat, pos[1].lng] ]}></Polyline>		
	// 	} ) 
	//  } 

    /* ROUTING MACHINE TO GET THE MAP MATCHED */
    // <RoutingMachine path={path}></RoutingMachine>
    
    return ( <> 
        { <Path path={paths[0]} zoom={mapZoom} measurement={measurements[0]}></Path>}
    </> )
}

export default Ride;
