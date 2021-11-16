import { FC } from "react";
import { MapContainer, TileLayer } from 'react-leaflet'

import { RidePos } from '../assets/models'
// import { roadStatusToCoords } from "../assets/road_utils";

import '../css/map.css'


type Props = {
  ridePos: RidePos;
};

// //  {/* <RoutingMachine path={ridePos} /> */}
//       {/* <Ride rideId={rideId}></Ride> */}

const MapWrapper: FC<Props> = ( { ridePos } ) => {    
  return (
    <MapContainer 
      center={ridePos[ridePos.length / 2]} 
      zoom={6} 
      scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  )
}

export default MapWrapper;
