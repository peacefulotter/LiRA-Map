import { FC, useState, useEffect } from "react";
import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet'
import { LeafletMouseEvent, LatLngBounds, LatLng } from 'leaflet'

import RideCards from "./RideCards";
import RideDetails from "./RideDetails";
import Ride from "./Ride";

import { get } from '../../assets/fetch'
import { RideMeta, Measurements } from '../../assets/models'

import '../../css/rides.css'


const Rides: FC = () => {
    const [ metas, setMetas ] = useState<RideMeta[]>([]);
    const [ selectedRides, setSelectedRides ] = useState<number[]>([]);
    const [ measurementTypes, setMeasurementTypes ] = useState<(keyof Measurements)[]>([]);
    const [ zoom, setZoom ] = useState<number>(11);

    // fetch the metadata of all the rides
    useEffect( () => {
        get( '/rides', (data: any) => setMetas(data) )
    }, [] );
    

    const showRide = (i: number, isChecked: boolean) => {         
        isChecked
            ? setSelectedRides( prev => [...prev, i] ) 
            : setSelectedRides( selectedRides.filter(r => r != i) )        
    }

    const measurementClicked = (measurement: keyof Measurements, isChecked: boolean) => {        
        isChecked 
            ? setMeasurementTypes( prev => [...prev, measurement])
            : setMeasurementTypes( prev => prev.filter(value => value != measurement))
    }

    // TODO: remove this later
    function LocationMarker() {
        useMapEvents( {
          click: (e: LeafletMouseEvent) => {
            console.log(e);
          },
          zoom : (e: any) => {
              setZoom(e.target._animateToZoom);
          }
        } )
      
        return null;
    }



    // <RoutingMachine path={roadStatusToCoords(currentRide.segments)} />
    return (
        <div className="rides-wrapper">
            <RideCards metas={metas} onClick={showRide}/>
            
            <RideDetails measurementClick={measurementClicked} metas={selectedRides.map(i => metas[i])} ></RideDetails>
            
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
                    { metas.map( (meta: RideMeta, i: number) =>
                        !selectedRides.includes(i) 
                            ? <div key={`ride-road-${i}`}></div>
                            : <Ride measKeys={measurementTypes} tripId={meta.TripId} mapZoom={zoom} key={`ride-road-${i}`}></Ride>
                    ) }
                </MapContainer>
            </div>
      </div>
    
  )
}

export default Rides;
