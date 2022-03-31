import { FC, useEffect, useState } from "react";

import RideCards from "./RideCards";
import RideDetails from "./RideDetails";
import Chart, { ChartAddFunc, ChartRemFunc } from "./Chart";

import Ride from "../Map/Ride";
import MapWrapper from "../Map/MapWrapper";

import { RideMeta } from '../../assets/models'
import { get } from "../../assets/fetch";

import '../../css/rides.css'
import { MeasurementsProvider } from "../../context/MeasurementsContext";


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
                        {
                            selectedRides.map( (i: number) => {
                                return <Ride
                                    key={`Ride${Math.random()}`}
                                    tripId={metas[i].TripId}
                                    taskId={metas[i].TaskId}
                                    addChartData={addChartData}
                                    removeChartData={remChartData} />
                            } )
                        }
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
