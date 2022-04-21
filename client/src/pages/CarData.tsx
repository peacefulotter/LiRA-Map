import { FC, useState } from "react";
import { MeasurementData, SegmentProps } from "../models/models";

import MapWrapper from "../Components/Map/MapWrapper";
import MapEvents from "../Components/CarData/MapEvents";
import Measurements from "../Components/CarData/Measurements";
import Segments from "../Components/CarData/Segments";
import SegmentPopup from "../Components/CarData/SegmentPopup";
const CarData: FC = () => {

    const [measurements, setMeasurements] = useState<MeasurementData[]>([]);
    const [segments, setSegments] = useState<SegmentProps[]>([]);

    return (
        <>
            <div className="ml-wrapper">
                <MapWrapper>
                    <Segments segments={segments} />
                    <Measurements measurements={measurements} />
                    <MapEvents setMeasurements={setMeasurements} setSegments={setSegments}></MapEvents>        
                </MapWrapper>
            </div>
        </>
        
    );
}

export default CarData;