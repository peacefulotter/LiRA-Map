import React, { FC, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet'
import { LocationEvent, LatLng, LatLngExpression, LeafletMouseEvent } from 'leaflet';

import RoutingMachine from "./RoutingMachine";
import Road from "./Road";
import { RoadModel } from '../assets/models'

import '../css/map.css'


type Props = {
  roadStatus: RoadModel;
};

const MapWrapper: FC<Props> = ( { roadStatus } ) => {
  function LocationMarker() {
    const [position, setPosition] = useState<LatLng | null>(null)
    const map = useMapEvents( {
      click(e: LeafletMouseEvent) {
        console.log(e);
        // setPosition(e.latlng)
        map.flyTo(e.latlng, map.getZoom())
      },
      // when using map.locate()
      locationfound(e: LocationEvent ) {
        console.log(e);
      },
    } )
  
    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    )
  }

  const segments = roadStatus.paths.length;
  let roadCoords: LatLngExpression[] = []
  for (let i = 0; i < segments; i++) 
      roadCoords.push( roadStatus.paths[ i ][ 0 ], roadStatus.paths[ i ][ 1 ] )


  console.log(roadStatus);
  console.log(roadCoords);

  return (
    <MapContainer 
      center={roadStatus.paths[ 0 ][ 0 ]} 
      zoom={5} 
      scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline pathOptions={{color: 'purple'}} positions={roadCoords} />
      <LocationMarker  />
      <RoutingMachine roadStatus={roadStatus} />
      <Road roads={roadStatus}></Road>
    </MapContainer>
  )
}

export default MapWrapper;
