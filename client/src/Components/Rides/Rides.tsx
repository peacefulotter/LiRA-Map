import { FC, useState, useEffect } from "react";

import RideCards from "./RideCards";
import RideDetails from "./RideDetails";
import useChart from "./useChart";

import Ride from "../Renderers/Ride";
import { get } from '../../assets/fetch'
import { RideMeta } from '../../assets/models'
import useMeasurements from "../Renderers/Measurements";
import MapWrapper from "../Map";

import '../../css/rides.css'


const Rides: FC = () => {
    const [ measurements, setMeasurements ] = useMeasurements();
    const [ activeMeasurements, setActiveMeasurements ] = useState<number[]>([]);
    const [ metas, setMetas ] = useState<RideMeta[]>([]);
    const [ selectedRides, setSelectedRides ] = useState<number[]>([]);
    const { addChartData, removeChartData, chart } = useChart()    

    // fetch the metadata of all the rides
    useEffect( () => {
        get( '/rides', (data: any) => setMetas(data.filter((d: RideMeta) => d.TaskId !== 0 )) )
    }, [] );
    

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
                <MapWrapper>
                    {
                        metas
                            .filter( (meta: RideMeta, i: number) => selectedRides.includes(i) )
                            .flatMap( (meta: RideMeta) => Ride( {
                                measurements: measurements,
                                activeMeasurements: activeMeasurements,
                                tripId: meta.TripId,
                                taskId: meta.TaskId,
                                addChartData: addChartData,
                                removeChartData: removeChartData
                            } )
                        )
                    }
                </MapWrapper>
                    
                { chart }
            </div>
      </div>
    
  )
}

export default Rides;
