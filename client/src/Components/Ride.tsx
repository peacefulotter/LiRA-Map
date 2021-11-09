import { FC, useState, useEffect } from "react";
import { LatLng } from 'leaflet'
import { Polyline, Circle } from 'react-leaflet'

import { RidePos } from '../assets/models'

import '../css/road.css'


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
            setPath(data);
            console.log("Got data for ride: ", tripId);  
        })
    }, [] );

    return <> { 
		path.map( (pos: LatLng, i: number) => {			
			return <Circle center={[pos.lat, pos.lng]} radius={1} key={tripId + 'circle' + i} />
		} ) 
	} </>
}

export default Ride;
