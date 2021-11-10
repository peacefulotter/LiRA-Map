import { FC, useState, useEffect } from "react";
import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet'
import { LeafletMouseEvent, LocationEvent } from 'leaflet'

import RoutingMachine from "../RoutingMachine";
import RideCards from "./RideCards";
import RideDetails from "./RideDetails";
import Ride from "../Ride";

import { RideMeta, Measurements } from '../../assets/models'

import '../../css/rides.css'


const Rides: FC = () => {
    const [ metas, setMetas ] = useState<RideMeta[]>([]);
    const [ selectedRides, setSelectedRides ] = useState<number[]>([]);
    const [ measurementTypes, setMeasurementTypes ] = useState<Measurements>([]);

    useEffect( () => {
        fetch("/rides")
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            setMetas(data);
        })
    }, [] );

    useEffect(() => {
        console.log('after change', selectedRides);
        
    }, [selectedRides])
    

    const showRide = (i: number, isChecked: boolean) => {         
        console.log(selectedRides, i, isChecked);
        const rm = selectedRides.filter(r => r != i)
        console.log(rm);
        
               
        isChecked ?
            setSelectedRides( prev => [...prev, i] ) :
            setSelectedRides( rm )        
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
    if ( metas.length == 0 ) return <div className="rides-wrapper"></div>

    return (
        <div className="rides-wrapper">
            <RideCards metas={metas} onClick={showRide}/>
            
            <RideDetails metas={selectedRides.map(i => metas[i])} measurementTypes={measurementTypes}></RideDetails>
            
            <div className="map-container">
                <MapContainer 
                    center={[55.6720619937223, 12.558746337890627]} 
                    zoom={11} 
                    scrollWheelZoom={true}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker />
                    { selectedRides.map( (n: number, i: number) => {
                        console.log('drawing ride',n);
                        return <Ride tripId={metas[n].TripId} key={`ride-road-${i}`}></Ride>
                    }
                    ) }
                </MapContainer>
            </div>
      </div>
    
  )
}

export default Rides;
