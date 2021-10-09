import { FC, useState, useEffect } from "react";
import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet'
import { LatLng, LeafletMouseEvent, LocationEvent } from 'leaflet'


import RoutingMachine from "../RoutingMachine";
import RideCards from "./RideCards";
import RideDetails from "./RideDetails";
import Road from "../Road";

import { roadStatusToCoords } from "../../assets/road_utils";
import { RidesModel, Ride,  MeasurementsModel } from '../../assets/models'

import '../../css/rides.css'


const Rides: FC = () => {
    const [ rides, setRides ] = useState<RidesModel | null>(null);
    const [ selectedRides, setSelectedRides ] = useState<Ride[]>([]);
    const [ measurementTypes, setMeasurementTypes ] = useState<MeasurementsModel | any>(null);

    // FIXME: dont recall useEffect everytime 
    useEffect( () => {
        fetch("/rides")
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            setRides(data); // data as RidesModel
        })
    }, [] );

    // we may not need to fetch it from backend?
    // fetch("/measurements")
    //     .then((res) => res.json())
    //     .then((data) => {
    //         console.log(data);
    //         setMeasurementTypes(data); 
    //     })
    

    const showRide = (i: number, isChecked: boolean) => {        
        if ( rides != null )
            isChecked ?
                setSelectedRides( prev => [...prev, rides[i]] ) :
                setSelectedRides( prev => prev.filter(r => r != rides[i]) )      
    }

    // TODO: remove this later
    function LocationMarker() {
        const map = useMapEvents( {
          click(e: LeafletMouseEvent) {
            console.log(e);
          }
        } )
      
        return null;
    }


    // <RoutingMachine path={roadStatusToCoords(currentRide.segments)} />

    return (
        <div className="rides-wrapper">
            { (rides === null ) ? <></> : 
                <>
                <RideCards rides={rides} onClick={showRide}/>
                
                <RideDetails rides={selectedRides} measurementTypes={measurementTypes}></RideDetails>
                
                <div className="map-container">
                    <MapContainer 
                        center={[57.6792, 12]} 
                        zoom={11} 
                        scrollWheelZoom={true}>
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationMarker />
                        { selectedRides.map( (ride: Ride, i: number) => 
                            <Road roadSegments={ride.segments} key={`ride-road-${i}`}></Road>
                        ) }
                    </MapContainer>
                </div>
                </>
            }
      </div>
    
  )
}

export default Rides;
