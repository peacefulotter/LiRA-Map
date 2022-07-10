import { FC } from "react";

import { MeasurementsProvider } from "../context/MeasurementsContext";
import { MetasProvider } from "../context/MetasContext";

import RideDetails from "../Components/RoadMeasurements/RideDetails";
import RideCards from "../Components/RoadMeasurements/RideCards";
import Rides from "../Components/RoadMeasurements/Rides";


const RoadMeasurements = () => {

    return (
        <MeasurementsProvider>
        <MetasProvider>
            <div className="rides-wrapper">
                
                <RideCards />
                
                <RideDetails  />
                
                <Rides />
                
            </div>
        </MetasProvider>
        </MeasurementsProvider>
  )
}

export default RoadMeasurements;
