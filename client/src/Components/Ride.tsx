import { FC, useState, useEffect } from "react";
import { LatLng } from 'leaflet'
import { Polyline, Circle } from 'react-leaflet'

import { RidePos } from '../assets/models'

import '../css/road.css'
import RoutingMachine from "./RoutingMachine";


type Props = {
	tripId: string;
};

const Ride: FC<Props> = ( { tripId } ) => {
	const [path, setPath] = useState<RidePos>([])

	useEffect( () => {
        const credentials = {
            method:'POST',
            body: JSON.stringify({tripID: tripId}),
            headers: new Headers()
        }
        fetch("/ride", credentials)
        .then((res) => res.json())
        .then((data) => {
            const path = data.filter((e: RidePos, i: number) => i % 5 === 0 )
            setPath(path);
            console.log("Got data for ride: ", tripId, ", length: ", path.length);  
        })
    }, [] );



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
