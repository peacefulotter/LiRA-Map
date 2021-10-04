import { FC } from "react";
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
      <RoutingMachine roadSegments={roadSegments} />
      <Road roadSegments={roadSegments}></Road>
    </MapContainer>
  )
}

/*
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
  }*/

export default MapWrapper;
