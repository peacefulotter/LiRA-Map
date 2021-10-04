import React, { FC } from "react";
import L, { ControlOptions, LatLng } from 'leaflet';
import { Polyline } from 'react-leaflet';
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";

import "../css/map.css"

interface Props extends ControlOptions {
  path: LatLng[];
};
  
const Routing = ( props: Props ) => {
    const { path } = props;
    console.log(path);
    const ride: LatLng[] = [path[0], path[1]]
    console.log(ride);
    

    const instance = L.Routing.control({
      waypoints: ride,
      plan: L.Routing.plan(ride, {
        createMarker: (i, wp, n) => {
          if (i == 0 || i == n - 1) {
            return L.marker( wp.latLng, { draggable: false } );
          } else {
            return L.marker( [0, 0] ); // TODO: change this
          }
        }
      }),
      lineOptions: {
        styles: [{color: 'white', opacity: 0.15, weight: 9}, {color: 'white', opacity: 0.8, weight: 6}, {color: 'purple', opacity: 1, weight: 2}],
        addWaypoints: false,
        missingRouteStyles: [{color: 'white', opacity: 0.15, weight: 7},{color: 'white', opacity: 0.6, weight: 4},{color: 'purple', opacity: 0.8, weight: 2, dashArray: '7,12'}],
        extendToWaypoints: false,
        missingRouteTolerance: 0
      },
      addWaypoints: false // prevent users from adding new waypoints
    });

    let a: LatLng[] = []
    instance.on('routesfound', function (e) {
      let route = e.routes[0];
      a = route.coordinates;
      console.log(e);
    });
    
        
    return instance;
    // console.log(a);
    // return <Polyline pathOptions={{color: 'purple'}} positions={a}></Polyline> 
}

const RoutingMachine = createControlComponent<L.Control, Props>( Routing );

export default RoutingMachine;