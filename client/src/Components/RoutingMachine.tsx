import React, { FC } from "react";
import L, { ControlOptions, LatLng } from 'leaflet';
import { Polyline } from 'react-leaflet';
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import "../css/map.css"

import { RoadSegments } from '../assets/models'

interface Props extends ControlOptions {
  roadSegments: RoadSegments;
};
  
const Routing = ( props: Props ) => {
    const { roadSegments } = props;
    console.log(roadSegments);

    // test DTU 
    const waypoints: LatLng[] = [
        L.latLng(55.786310539667284, 2172.514330870493),
        L.latLng(55.77858920835069, 2172.508258740918),
        L.latLng(55.77443831729525, 2172.5152535157754)
    ]

    const paris: LatLng[] = [
      L.latLng(48.867195112021115, 2.3632306776047907),
      L.latLng(48.837142068931385, 2.3179338465416466),
    ]

    const danemark: LatLng[] = [
      L.latLng(55.673876269102614,  12.565291822766696),
      L.latLng(55.78571634739484,   12.52142049280467)
    ]

    const instance = L.Routing.control({
      waypoints: danemark,
      plan: L.Routing.plan(danemark, {
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

    let path: LatLng[] = []
    instance.on('routesfound', function (e) {
      let route = e.routes[0];
      path = route.coordinates;
      console.log(e);
    });
    
        
    return instance;
    // console.log(path);
    // return <Polyline pathOptions={{color: 'purple'}} positions={path}></Polyline> 
}

const RoutingMachine = createControlComponent<L.Control, Props>( Routing );

export default RoutingMachine;