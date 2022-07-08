import { FC } from "react";

import { MeasurementsProvider } from "../context/MeasurementsContext";
import { MetasProvider } from "../context/MetasContext";

import RideDetails from "../Components/Rides/RideDetails";
import RideCards from "../Components/Rides/RideCards";
import Rides from "../Components/Rides/Rides";


const Trips: FC = () => {

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

export default Trips;
