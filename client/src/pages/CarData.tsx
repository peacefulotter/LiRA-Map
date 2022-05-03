import { FC, useState } from "react";
import { MeasurementData, SegmentInterface} from "../models/models";

import MapWrapper from "../Components/Map/MapWrapper";
import MapEvents from "../Components/CarData/MapEvents";
import Measurements from "../Components/CarData/Measurements";
import Segments, { SegmentsProps } from "../Components/CarData/Segments";
import { LatLng } from "leaflet";
const CarData: FC = () => {

    const [measurements, setMeasurements] = useState<MeasurementData[]>([]);
    const [boundaries, setBoundaries] = useState<LatLng[]>()

    return (
        <>
            <div className="ml-wrapper">
                <MapWrapper>
                    {boundaries != undefined &&
                        <Segments boundaries={boundaries} type="inertialForce" aggregation="average" /> 
                    }
                    <MapEvents setMeasurements={setMeasurements} setBoundaries={setBoundaries}></MapEvents>        
                </MapWrapper>
            </div>
        </>
        
    );
}

export default CarData;