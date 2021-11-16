import { FC, useState, useEffect, useRef } from "react";
import { LatLng } from 'leaflet'
import { Polyline, Circle } from 'react-leaflet'

import { RidePos } from '../assets/models'
import { RideMeta, Measurements } from '../assets/models'

import RoutingMachine from "./RoutingMachine";

import { post } from '../assets/fetch'
import '../css/road.css'


type Props = {
	tripId: string;
    measurements: Measurements[];
};

const usePrevious = <T extends unknown>(value: T): T | undefined => {
    const ref = useRef<T>();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

const Ride: FC<Props> = ( { tripId, measurements } ) => {
	const [path, setPath] = useState<RidePos>([])
    const prevMeasurements = usePrevious<Measurements[]>(measurements);
        
    useEffect( () => {
        console.log(measurements)
        let path;
        const newMeasurement: Measurements = measurements
            .filter( m => !prevMeasurements?.includes(m) )[0];

        switch (newMeasurement) {
            case Measurements["Track Position"]:
                path = '/ride'
                break;
            case Measurements.Interpolation:
                path = '/inter_ride'
                break;
            case Measurements["Map Matching"]:
                path = '/ride' // TODO: add a proper path
                break;
            default:
                path = '/ride'
                break;
        }

        post(path, {tripID: tripId}, (data: any) => {
            const path = data.filter((_e: RidePos, i: number) => i % 5 === 0 )
            setPath(path);
            console.log("Got data for ride: ", tripId, ", length: ", path.length);      
        })
    }, [measurements] );
    

    let groupedPos = []
    for (let i = 0; i < path.length - 2; i++) {
        groupedPos.push([path[i], path[i+1]])
    }
    
    return ( <> 
    
        <RoutingMachine path={path}></RoutingMachine>
        { 
		groupedPos.map( (pos: LatLng[], i: number) => {	
            // return <Polyline positions={[ [pos[0].lat, pos[0].lng], [pos[1].lat, pos[1].lng] ]}></Polyline>		
			return <Circle center={[pos[0].lat, pos[0].lng]} radius={1} key={tripId + 'circle' + i} />
		} ) 
	    } 
    </> )
}

export default Ride;
