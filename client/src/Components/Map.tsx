import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

interface RoadModel {
  position: {
    x : number,
    y : number
  }
}

const Map: React.FC<RoadModel> = ( props ) => {
  console.log(props.position);
  const pos = {x: 30, y: 30 }
  return (
    <MapContainer center={[props.position.x, props.position.y]} zoom={5} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[pos.x, pos.y]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  )
}

export default Map;
