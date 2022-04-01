import { FC, useEffect, useState } from "react";

import Chart, { ChartAddFunc, ChartRemFunc } from "../Components/Rides/Chart";
import RideDetails from "../Components/Rides/RideDetails";
import MapWrapper from "../Components/Map/MapWrapper";
import RideCards from "../Components/Rides/RideCards";
import Ride from "../Components/Map/Ride";

import { MeasurementsProvider } from "../context/MeasurementsContext";
import { RideMeta } from "../models/models";
import { get } from "../queries/fetch";


const Rides: FC = () => {
    const [ metas, setMetas ] = useState<RideMeta[]>([]);
    const [ selectedRides, setSelectedRides ] = useState<number[]>([]);

    const [addChartData, setAddChartData] = useState<ChartAddFunc>(() => {});
    const [remChartData, setRemChartData] = useState<ChartRemFunc>(() => {});

    // fetch the metadata of all the rides
    useEffect( () => {
        get( '/rides', (data: any) => 
            setMetas(data.filter((d: RideMeta) => d.TaskId !== 0 )) 
        )
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

            remChartData(metas[removed].TaskId.toString())
        } 
    }

    return (
        <MeasurementsProvider>
            <div className="rides-wrapper">
                
                <RideCards metas={metas} onClick={showRide}/>
                
                <RideDetails metas={selectedRides.map(i => metas[i])} />
                
                <div className="map-container">
                    <MapWrapper>
                        { selectedRides.map( (i: number) => {
                            return <Ride
                                key={`Ride${Math.random()}`}
                                tripId={metas[i].TripId}
                                taskId={metas[i].TaskId}
                                addChartData={addChartData}
                                removeChartData={remChartData} />
                        } ) }
                    </MapWrapper>
                        
                    <Chart 
                        setAddChartData={setAddChartData}
                        setRemChartData={setRemChartData}
                    />
                </div>
        </div>
    </MeasurementsProvider>
  )
}

export default Rides;
