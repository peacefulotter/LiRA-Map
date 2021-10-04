import { FC, useState } from "react";
import { MapContainer, TileLayer, Polyline } from 'react-leaflet'

import RoutingMachine from "./RoutingMachine";
import Road from "./Road";
import { RoadSegments } from '../assets/models'
import { roadStatusToCoords } from "../assets/road_utils";

import '../css/map.css'


type Props = {
  roadSegments: RoadSegments;
};

const MapWrapper: FC<Props> = ( { roadSegments } ) => {

  const roadCoords = roadStatusToCoords( roadSegments )
  // <Polyline pathOptions={{color: 'purple'}} positions={roadCoords} />
 
    
  return (
    <MapContainer 
      center={roadSegments[0].path[ 0 ]} 
      zoom={6} 
      scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <RoutingMachine path={roadCoords} />
      <Road roadSegments={roadSegments}></Road>
    </MapContainer>
  )
}

/*



*/

export default MapWrapper;
