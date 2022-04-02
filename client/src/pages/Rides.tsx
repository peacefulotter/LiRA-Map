import { FC, useCallback, useEffect, useState } from "react";

import Chart from "../Components/Rides/Chart";
import RideDetails from "../Components/Rides/RideDetails";
import MapWrapper from "../Components/Map/MapWrapper";
import RideCards from "../Components/Rides/RideCards";

import { MeasurementsProvider } from "../context/MeasurementsContext";
import { RideMeta } from "../models/models";
import { getRides } from "../queries/rides";
import Ride from "../Components/Rides/Ride";
import { ChartProvider } from "../context/ChartContext";


const Rides: FC = () => {
    const [ metas, setMetas ] = useState<RideMeta[]>([]);
    const [ shownMetas, setShownMetas ] = useState<RideMeta[]>([]);

    // fetch the metadata of all the rides
    useEffect( () => getRides(setMetas), [] );

    const showRide = (i: number, isChecked: boolean) => {   
        if ( isChecked )      
            setShownMetas( prev => [...prev, metas[i]] ) 
        else
        {
            let removed = 0;
            setShownMetas( prev => prev.filter( (meta, j) => { 
                if ( j === i )
                    removed = i;
                return j !== i
            } ) ) 
        } 
    }

    // const onChange = useCallback((id, value) => {
    //     setRides(rides.map((i: number, index: number) => metas[i]))
    // }, [rides])

    return (
        <MeasurementsProvider>
            <div className="rides-wrapper">
                
                <RideCards metas={metas} onClick={showRide}/>
                
                <RideDetails metas={shownMetas} />
                
                <ChartProvider>
                    <div className="map-container">
                        <MapWrapper>
                            
                                { shownMetas.map( (meta: RideMeta) => {
                                    return <Ride
                                        key={`Ride${Math.random()}`}
                                        tripId={meta.TripId}
                                        taskId={meta.TaskId} />
                                } ) }
                            
                        </MapWrapper>
                            
                        <Chart />
                    </div>
                </ChartProvider>
            </div>
        </MeasurementsProvider>
  )
}

export default Rides;
