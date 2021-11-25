import { FC, useState, useEffect, useRef } from "react";
import { LatLng } from 'leaflet'
import { Polyline, Circle } from 'react-leaflet'

import { RidePos, RideMeta, Measurements , AccelerationPoint, AccList} from '../../assets/models'

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
    //accelerations: AccList;
};

const usePrevious = <T extends unknown>(value: T): T | undefined => {
    const ref = useRef<T>();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

const Ride: FC<Props> = ( { tripId, measurements, mapZoom} ) => {
    const [ride, setRide] = useState<RidePos>([])
	const [path, setPath] = useState<RidePos>([])
    const prevMeasurements = usePrevious<Measurements[]>(measurements)
    //const [accs, setaccs] = useState<AccList>(accelerations);
        
    // TODO: use k nearest neighbor or something like this
    const performancePath = () => {
        if ( ride.length === 0 ) return;

        // first filter it to never show more then MAX_NB_POINTS
        const MAX_NB_POINTS = 2000
        const threshold = Math.floor(ride.length / MAX_NB_POINTS);
        console.log("threshold for filter", threshold);
        const r = ride.filter((r: LatLng, i: number) => i % threshold === 0 );
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
        setPath(updatedPath);
    }

    const getDiffMeasurements = (prevM: Measurements[]): MeasurementManagement => {
        return prevM.length > measurements.length 
            ? { m: prevM.filter( m => !measurements.includes(m) )[0], isAdded: false }
            : { m: measurements.filter( m => !prevM.includes(m) )[0], isAdded: true }
        
    }
    
    useEffect( () => {
        const newMeasurement: MeasurementManagement = prevMeasurements === undefined 
            ? { m: measurements[0], isAdded: true }
            : getDiffMeasurements(prevMeasurements)
        
        if ( !newMeasurement.isAdded )
        {
            setRide([])
            setPath([])
            return;
        }
        else if ( newMeasurement.m === Measurements.Map_Match )
        {
            console.log('USE MAP MATCH TODO');
            return;
        }

        const path = newMeasurement.m === Measurements.Track_Pos 
            ? '/ride'
            : '/inter_ride'        

            /*
        post('/acc', {tripID:tripId}, (data_acc: any) => {   //put it to try only!!!!
            console.log(data_acc)
            setaccs(data_acc);
        })
*/

        post(path, {tripID: tripId}, (data: any) => {
            setRide(data);
            performancePath();
            console.log("Got data for ride: ", tripId, ", length: ", data.length);      
        })

        

    }, [measurements] );

    useEffect( performancePath, [ride, mapZoom] )
    

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
        { <Path path={path} zoom={mapZoom} measurement={measurements[0]}></Path>}
    </> )
}

export default Ride;
