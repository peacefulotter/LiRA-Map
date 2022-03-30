import { FC, useEffect, useState } from "react";
import { MeasurementData, PathProps } from "../../assets/models";

import MapWrapper from "../Map/MapWrapper";
import MapEvents from "./MapEvents";
import Measurements from "./Measurements";
import Segments from "./Segments";

const CarData: FC = () => {

    const [measurements, setMeasurements] = useState<MeasurementData[]>([]);
    const [segments, setSegments] = useState<PathProps[]>([]);

    return (
        <div className="ml-wrapper">
            <MapWrapper>
                <Segments segments = {segments}></Segments>
                <Measurements measurements={measurements}></Measurements>
                <MapEvents setMeasurements={setMeasurements} setSegments={setSegments}></MapEvents>        
            </MapWrapper>
        </div>
    );
}

export default CarData;