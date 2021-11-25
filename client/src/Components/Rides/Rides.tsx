import { FC, useState, useEffect } from "react";
import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet'
import { LeafletMouseEvent, LatLngBounds, LatLng } from 'leaflet'

import RideCards from "./RideCards";
import RideDetails from "./RideDetails";
import Ride from "./Ride";
import RideChart from "./RideChart"

import { get } from '../../assets/fetch'
import { RideMeta, Measurements, RidePos, AccList } from '../../assets/models'

import { post } from '../../assets/fetch'
import '../../css/rides.css'
import { logRoles } from "@testing-library/dom";


const Rides: FC = () => {
    const [ metas, setMetas ] = useState<RideMeta[]>([]);
    const [ selectedRides, setSelectedRides ] = useState<number[]>([]);
    const [ measurementTypes, setMeasurementTypes ] = useState<Measurements[]>([]);
    const [ zoom, setZoom ] = useState<number>(11);
    const [ bounds, setBounds ] = useState<LatLngBounds | undefined>(undefined)
    const [accs, setaccs] = useState<AccList>([]);

    // fetch the metadata of all the rides
    useEffect( () => {
        get( '/rides', (data: any) => setMetas(data) )
    }, [] );
    

    const showRide = (i: number, isChecked: boolean) => {         
        console.log(selectedRides, i, isChecked);
        const rm = selectedRides.filter(r => r != i)
                   
        isChecked ?
            setSelectedRides( prev => [...prev, i] ) :
            setSelectedRides( rm )   
        

        post('/acc', {tripID:selectedRides[0]}, (data_acc: any) => {   //put it to try only!!!!
                console.log(data_acc)  //selected ride should be found then data_acc should be given to ridechart
                
                setaccs(data_acc);
        })
    }

    const measurementClicked = (measurement: Measurements, isChecked: boolean) => {
        isChecked 
            ? setMeasurementTypes( prev => [...prev, measurement])
            : setMeasurementTypes( prev => prev.filter(value => value != measurement))
    }

    // TODO: remove this later
    function LocationMarker() {
        const map = useMapEvents( {
          click: (e: LeafletMouseEvent) => {
            console.log(e);
          },
          zoom : (e: any) => {
              setZoom(e.target._animateToZoom);
          },
          tileunload: (e: any) => {
            console.log(e);
            
          },
          tileload: (e: any) => {
            console.log(e);
            
          },
          loading: (e: any) => {
              console.log(e);
              
          },
          tileloadstart:(e: any) => {
            console.log(e);
            
        }, 
        update: (e: any) => {
            console.log(e);
            
        },
        } )
      
        return null;
    }

    const tileEventsHandler = {
        tileload: (e: any) => { 
            // console.log(e);
                       
            const coords = e.coords;
            const southWest: LatLng = new LatLng(
                coords.x,
                coords.y,
                coords.z
            )
            const northEast: LatLng = new LatLng(
                coords.x + e.target._tileSize.x,
                coords.y + e.target._tileSize.y,
                coords.z
            )
            // console.log(coords);
            
            // console.log(southWest, northEast);
            const newBounds = new LatLngBounds(southWest, northEast);

            if ( bounds === undefined  )
                setBounds(newBounds)
            else
            {
                // minX = 
            }
            // console.log(bounds);
                        
        },
        tileunload: (e: any) => console.log('unload')
        
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
                        eventHandlers={tileEventsHandler}
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker />
                    { selectedRides.map( (n: number, i: number) => {
                        // console.log('drawing ride',n);
                        return <Ride measurements={measurementTypes} tripId={metas[n].TripId} mapZoom={zoom} key={`ride-road-${i}`} ></Ride>
                    }
                    ) }
                </MapContainer>
            </div>
            <div className="chart-container">
                <RideChart/>
            </div>
      </div>
    
  )
}

export default Rides;
