import { FC, useRef } from "react";

import { MeasurementsProvider } from "../context/MeasurementsContext";
import { MetasProvider } from "../context/MetasContext";

import RideDetails from "../Components/Rides/RideDetails";
import RideCards from "../Components/Rides/RideCards";
import Rides from "../Components/Rides/Rides";

import { PathsProvider } from "../context/PathsContext";


const Trips: FC = () => {

    return (
        <MeasurementsProvider>
        <MetasProvider>
            <div className="rides-wrapper">
                
                <RideCards />
                
                <RideDetails  />
                
                <PathsProvider>
                    <Rides />
                </PathsProvider>
                
            </div>
        </MetasProvider>
        </MeasurementsProvider>
  )
}

export default Trips;
