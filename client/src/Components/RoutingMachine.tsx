import { FC, useState } from "react";
import L, { ControlOptions, LatLng } from 'leaflet';
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";

import { RidePos } from '../assets/models'

import "../css/map.css"

interface Props extends ControlOptions {
	path: RidePos
};

const getInstance = (path: RidePos) => {

	console.log(path);
	
	// FIXME: MAX 100 POINTS
	const instance = L.Routing.control( {
    	waypoints: path,
     	// plan: L.Routing.plan(path, {
        	// createMarker: (i, wp, n) => {
			// if (i == 0 || i == n - 1) {
			// 	return L.marker( wp.latLng, { draggable: false } );
			// } else {
			// 	return L.marker( [0, 0] ); // TODO: change this
			// }
			// }
      	// } ),
		router: new L.Routing.OSRMv1({
			serviceUrl: 'http://liradbdev.compute.dtu.dk:5000/match/v1/car/'
		}),
		lineOptions: {
			styles: [
				{color: 'white',  opacity: 0.15, weight: 9}, 
				{color: 'white',  opacity: 0.8,  weight: 6}, 
				{color: 'purple', opacity: 1,    weight: 2}
			],
			addWaypoints: false,
			missingRouteStyles: [
				{color: 'white', opacity: 0.15, weight: 7},
				{color: 'white', opacity: 0.6, weight: 4},
				{color: 'purple', opacity: 0.8, weight: 2, dashArray: '7,12'}
			],
			extendToWaypoints: false,
			missingRouteTolerance: 0.05
		},
      	addWaypoints: false // prevent users from adding new waypoints
    } );

   
    instance.on('routesfound', function (e) {
      	// let route = e.routes[0];
      	// setCoords(route.coordinates);
		// use setSegments()
		// route.coordinates.forEach((coord: LatLng) => {
			
		// });
      	console.log("route found", e);
    });

	instance.on('routingerror', function (e) {
		console.log("routing error", e);
  	});

	return instance;
}
  
const Routing = ( props: Props ) => {
	const { path } = props;
	// const [coords, setCoords] = useState<LatLng[] | null>(null)
	// const [segments, setSegments] = useState<RideModel | null>(null)
	// const waypoints = path.filter((e: LatLng, i: number) => i % 50 === 0 )

	const instance = getInstance(path)
   	return instance;
}

const RoutingMachine = createControlComponent<L.Control, Props>( Routing );

export default RoutingMachine; 