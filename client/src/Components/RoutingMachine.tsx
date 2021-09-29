import React, { FC } from "react";
import L, { ControlOptions, Map, LatLng } from 'leaflet';
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import "../css/map.css"

import { RoadModel } from '../assets/models'

interface Props extends ControlOptions {
    roadStatus: RoadModel;
};
  
const Routing = ( props: Props ) => {
    console.log(props);
    const { roadStatus } = props;
    // if ( map == null ) return (<></>);
    console.log(roadStatus);

    // test DTU 
    const waypoints: LatLng[] = [
        L.latLng(55.786310539667284, 2172.514330870493),
        L.latLng(55.77858920835069, 2172.508258740918),
        L.latLng(55.77443831729525, 2172.5152535157754)
    ]

    const data: LatLng[] = [
        L.latLng(13.0827, 80.2707),
        L.latLng(13.0317, 80.1817),
        L.latLng(12.8342, 79.7036)
    ]

    const instance = L.Routing.control({
        waypoints: data,
        plan: L.Routing.plan(data, {
          createMarker: (i, wp, n) => {
            if (i == 0 || i == n - 1) {
              return L.marker( wp.latLng, { draggable: false } );
            } else {
              return L.marker( [0, 0] ); // TODO: change this
            }
          }
        }),
        addWaypoints: false // prevent users from adding new waypoints
      });
    
    /*
    const instance = L.Routing.control({
        waypoints: waypoints,
        lineOptions: {
            extendToWaypoints: false,
            missingRouteTolerance: 1,
            styles: [
                {
                color: "red",
                opacity: 0.9,
                weight: 5
                }
            ]
        },
        addWaypoints: false,
        fitSelectedRoutes: true,
        showAlternatives: true
    })*/
        
    return instance;
}

const RoutingMachine = createControlComponent<L.Control, Props>( Routing );

export default RoutingMachine;