import { FC, useEffect, useState } from "react";

import RideCards from "./RideCards";
import RideDetails from "./RideDetails";
import Chart, { ChartAddFunc, ChartRemFunc } from "./Chart";

import Ride from "../Map/Ride";
import { RideMeta } from '../../assets/models'
import useMeasurements from "../Map/Measurements";
import MapWrapper from "../Map/MapWrapper";

import '../../css/rides.css'
import { get } from "../../assets/fetch";


const Rides: FC = () => {
    const [ measurements, setMeasurements ] = useMeasurements();
    const [ activeMeasurements, setActiveMeasurements ] = useState<number[]>([]);
    const [ metas, setMetas ] = useState<RideMeta[]>([]);
    const [ selectedRides, setSelectedRides ] = useState<number[]>([]);

    const [addChartData, setAddChartData] = useState<ChartAddFunc>(() => {});
    const [remChartData, setRemChartData] = useState<ChartRemFunc>(() => {});

    // fetch the metadata of all the rides
    useEffect( () => {
        get( '/rides', (data: any) => setMetas(data.filter((d: RideMeta) => d.TaskId !== 0 )) )
    }, [] );

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

            remChartData(metas[removed].TaskId.toString())
        } 
    }

    const measurementClicked = (measurement: number, isChecked: boolean) => {        
        isChecked 
            ? setActiveMeasurements( prev => [...prev, measurement])
            : setActiveMeasurements( prev => prev.filter(value => value !== measurement))
    }

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
                            .flatMap( (meta: RideMeta) => {
                                return <Ride
                                    key={`Ride${Math.random()}`}
                                    measurements={measurements}
                                    activeMeasurements={activeMeasurements}
                                    tripId={meta.TripId}
                                    taskId={meta.TaskId}
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
    
  )
}

export default Rides;
