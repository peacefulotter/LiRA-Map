import { FC, useState, useEffect } from "react";
import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet'
import { LatLng, LeafletMouseEvent, LocationEvent } from 'leaflet'


import RoutingMachine from "../RoutingMachine";
import RideCard from "./RideCard";
import Road from "../Road";

import { roadStatusToCoords } from "../../assets/road_utils";
import { RidesModel, Ride } from '../../assets/models'

import '../../css/rides.css'


const Rides: FC = () => {
    const [ rides, setRides ] = useState<RidesModel | undefined>(undefined);
    const [ currentRide, setCurrentRide ] = useState<Ride | undefined>(undefined);

    useEffect( () => {
        fetch("/rides")
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            setRides(data); // data as RidesModel
            setCurrentRide(data[1])
        })
    }, [] );

    const showRide = (i: number) => {
        console.log(i);
        console.log(currentRide);
        
        if ( rides !== undefined )
            setCurrentRide( rides[i] );
        console.log(currentRide);
        
    }


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
          </Marker>
        )
      }

    // <Polyline pathOptions={{color: 'purple'}} positions={roadCoords} />
    return (
        <div className="rides-wrapper">
            { (rides === undefined || currentRide === undefined) ? <></> : 
                <>
                <div className="ride-list">
                    { rides.map( (r: Ride, i: number) => {
                        return <RideCard ride={r} index={i} onClick={showRide} key={`ride${i}`}></RideCard>
                      })
                    }
                </div>
                <div className="map-container">
                    <MapContainer 
                        center={currentRide.segments[ 0 ].path[ 0 ]} 
                        zoom={11} 
                        scrollWheelZoom={true}>
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationMarker />

                        <RoutingMachine path={roadStatusToCoords(currentRide.segments)} />
                        <Road roadSegments={currentRide.segments}></Road>
                    </MapContainer>
                </div>
                </>
            }
      </div>
    
  )
}

export default Rides;
