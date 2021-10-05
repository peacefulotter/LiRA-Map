import { FC, useState, useEffect } from "react";
import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet'
import { LatLng, LeafletMouseEvent, LocationEvent } from 'leaflet'


import RoutingMachine from "../RoutingMachine";
import RideCard from "./RideCard";
import MetaDataTab from "./MetaDataTab";
import Road from "../Road";

import { roadStatusToCoords } from "../../assets/road_utils";
import { RidesModel, Ride } from '../../assets/models'

import '../../css/rides.css'


const Rides: FC = () => {
    const [ rides, setRides ] = useState<RidesModel | null>(null);
    const [ currentRide, setCurrentRide ] = useState<Ride | null>(null);

    // FIXME: dont recall useEffect everytime 
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
        if ( rides != null )
            setCurrentRide( rides[i] );        
    }

    function LocationMarker() {
        const map = useMapEvents( {
          click(e: LeafletMouseEvent) {
            console.log(e);
          }
        } )
      
        return null;
    }

    return (
        <div className="rides-wrapper">
            { (rides === null || currentRide === null) ? <></> : 
                <>
                <div className="ride-list">
                    { rides.map( (r: Ride, i: number) => {
                        return <RideCard ride={r} index={i} onClick={showRide} key={`ride${i}`}></RideCard>
                      })
                    }
                </div>
                <div className="meta-data">
                        <MetaDataTab ride={currentRide} key={`ride${currentRide}`}></MetaDataTab>
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
