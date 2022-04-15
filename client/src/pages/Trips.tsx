import { FC, useRef } from "react";

import { MeasurementsProvider } from "../context/MeasurementsContext";
import { GraphProvider } from "../context/GraphContext";
import { MetasProvider } from "../context/MetasContext";

import RideDetails from "../Components/Rides/RideDetails";
import MapWrapper from "../Components/Map/MapWrapper";
import RideCards from "../Components/Rides/RideCards";
import Rides from "../Components/Rides/Rides";
import Graph from "../Components/Graph/Graph";


const Trips: FC = () => {

    return (
        <MeasurementsProvider>
        <MetasProvider>
            <div className="rides-wrapper">
                
                <RideCards />
                
                <RideDetails  />
                
                <GraphProvider>
                    <div className="map-container">

                        <MapWrapper>
                            <Rides />
                        </MapWrapper>
                        
                        <Graph labelX="time / dist" labelY="Measurement"/>
                    
                    </div>
                </GraphProvider>
            </div>
        </MetasProvider>
        </MeasurementsProvider>
  )
}

export default Trips;
