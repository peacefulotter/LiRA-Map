import { FC, useState, useEffect } from "react";
import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'

import RideCards from "./RideCards";
import RideDetails from "./RideDetails";
import Ride from "../Ride";

import { get } from '../../assets/fetch'
import { RideMeta, Measurements } from '../../assets/models'

import '../../css/rides.css'


const Rides: FC = () => {
    const [ metas, setMetas ] = useState<RideMeta[]>([]);
    const [ selectedRides, setSelectedRides ] = useState<number[]>([]);
    const [ measurementTypes, setMeasurementTypes ] = useState<Measurements[]>([]);

    // fetch the metadata of all the rides
    useEffect( () => {
        get( '/rides', (data: any) => setMetas(data) )
    }, [] );
    

    const showRide = (i: number, isChecked: boolean) => {         
        console.log(selectedRides, i, isChecked);
        const rm = selectedRides.filter(r => r != i)
        console.log(rm);
           
        isChecked ?
            setSelectedRides( prev => [...prev, i] ) :
            setSelectedRides( rm )        
    }


    const measurementClicked = (measurement: Measurements, isChecked: boolean) =>{
        isChecked 
            ? setMeasurementTypes( prev => [...prev, measurement])
            : setMeasurementTypes( prev => prev.filter(value => value != measurement))
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
            
            <RideDetails measurementClick={measurementClicked}  metas={selectedRides.map(i => metas[i])} ></RideDetails>
            
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
                        return <Ride measurements={measurementTypes} tripId={metas[n].TripId} key={`ride-road-${i}`}></Ride>
                    }
                    ) }
                </MapContainer>
            </div>
      </div>
    
  )
}

export default Rides;
