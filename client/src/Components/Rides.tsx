import { FC, useState, useEffect } from "react";
import { MapContainer, TileLayer } from 'react-leaflet'
import L from 'leaflet'

import RoutingMachine from "./RoutingMachine";
import Road from "./Road";
import { RidesModel } from '../assets/models'

import '../css/map.css'


const Rides: FC = () => {
    const [rides, setRides] = useState<RidesModel | undefined>(undefined);

    useEffect( () => {
        fetch("/rides")
        .then((res) => res.json())
        .then((data) => {
            console.log(data.rides);
            setRides(data.rides as RidesModel);
        })
    }, [] );

    // <Polyline pathOptions={{color: 'purple'}} positions={roadCoords} />
    return (
        <div className="rides-wrapper">
            { rides === undefined ? <></> : 
                <>
                <div className="rides-list">

                </div>
                <div className="map-container">
                    <MapContainer 
                        center={rides[ 0 ].segments[ 0 ].path[ 0 ]} 
                        zoom={6} 
                        scrollWheelZoom={true}>
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <RoutingMachine roadSegments={rides[ 0 ].segments} />
                        <Road roadSegments={rides[ 0 ].segments}></Road>
                    </MapContainer>
                </div>
                </>
            }
      </div>
    
  )
}

export default Rides;
