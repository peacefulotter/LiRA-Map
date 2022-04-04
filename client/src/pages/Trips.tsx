import { FC } from "react";

import { MeasurementsProvider } from "../context/MeasurementsContext";
import { ChartProvider } from "../context/ChartContext";
import { MetasProvider } from "../context/MetasContext";

import RideDetails from "../Components/Rides/RideDetails";
import MapWrapper from "../Components/Map/MapWrapper";
import RideCards from "../Components/Rides/RideCards";
import Chart from "../Components/Rides/Chart";
import Rides from "../Components/Rides/Rides";


const Trips: FC = () => {
    return (
        <MeasurementsProvider>
        <MetasProvider>
            <div className="rides-wrapper">
                
                <RideCards />
                
                <RideDetails  />
                
                <ChartProvider>
                    <div className="map-container">

                        <MapWrapper>
                            <Rides />
                        </MapWrapper>
                        
                        <Chart />
                    
                    </div>
                </ChartProvider>
            </div>
        </MetasProvider>
        </MeasurementsProvider>
  )
}

export default Trips;
