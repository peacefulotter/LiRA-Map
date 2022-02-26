import { FC, useState, useEffect } from "react";
import { MapContainer, TileLayer, useMapEvent,  } from 'react-leaflet'

import RideCards from "./RideCards";
import RideDetails from "./RideDetails";
import useChart from "./useChart";
import Ride from "./Ride";

import { get } from '../../assets/fetch'
import { RideMeta } from '../../assets/models'

import '../../css/rides.css'
import useMeasurements from "./Measurements";
import { isPropertySignature } from "typescript";



const Rides: FC = () => {
    const [ measurements, setMeasurements ] = useMeasurements();
    const [ activeMeasurements, setActiveMeasurements ] = useState<number[]>([]);
    const [ metas, setMetas ] = useState<RideMeta[]>([]);
    const [ selectedRides, setSelectedRides ] = useState<number[]>([]);
    const { addChartData, removeChartData, chart } = useChart()    

    // fetch the metadata of all the rides
    /*useEffect( () => {
        get( '/rides', (data: any) => setMetas(data.filter((d: RideMeta) => d.TaskId !== 0 )) )
    }, [] );*/

    function changeMetas(value: any){
        setMetas(value);
    }

    const showRide = (i: number, isChecked: boolean) => {   
        if ( isChecked )      
            setSelectedRides( prev => [...prev, i] ) 
        else
        {
            let removed = 0;
            setSelectedRides( selectedRides.filter(r => { 
                if ( r === i )
                    removed = i;
                return r !== i
            } ) ) 

            removeChartData(metas[removed].TaskId.toString())
        } 
    }

    const measurementClicked = (measurement: number, isChecked: boolean) => {        
        isChecked 
            ? setActiveMeasurements( prev => [...prev, measurement])
            : setActiveMeasurements( prev => prev.filter(value => value !== measurement))
    }

    // <RoutingMachine path={roadStatusToCoords(currentRide.segments)} />
    return (
        <div className="rides-wrapper">
            <RideCards metas={metas} onClick={showRide}/>
            
            <RideDetails 
                measurements={measurements} setMeasurements={setMeasurements} measurementClick={measurementClicked}
                metas={selectedRides.map(i => metas[i])} />
            
            <div className="map-container">
                <MapContainer
                    preferCanvas={true}
                    center={[55.6720619937223, 12.558746337890627]} 
                    zoom={18} 
                    scrollWheelZoom={true}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    { metas.map( (meta: RideMeta, i: number) =>
                        !selectedRides.includes(i) 
                            ? <div key={`ride-road-${i}`}></div>
                            : <Ride key={`ride-road-${i}`} 
                                measurements={measurements} activeMeasurements={activeMeasurements} 
                                tripId={meta.TripId} taskId={meta.TaskId}
                                addChartData={addChartData} removeChartData={removeChartData} />
                    ) }
                </MapContainer>
                { chart }
            </div>
      </div>
    
  )
}

export default Rides;
