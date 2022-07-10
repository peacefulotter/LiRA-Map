import { FC, useState } from "react";
import { LatLng } from "leaflet";
import MapWrapper from "../Components/Map/MapWrapper";
import MapEvents from "../Components/CarData/MapEvents";
import Segments from "../Components/CarData/Segments";
import Toolbars from "../Components/CarData/toolbar/Toolbars";

import { SegmentProvider } from "../context/SegmentContext";


export interface SegTypes {
    dataType: string | undefined;
    aggrType: string | undefined;
    direction: number | undefined;
}

const CarData = () => {

    const [boundaries, setBoundaries] = useState<LatLng[]>([
        new LatLng(55.523966596348956, 12.030029296875002),
        new LatLng(55.523966596348956, 12.74620056152344),
        new LatLng(55.8089989927049, 12.74620056152344),
        new LatLng(55.8089989927049, 12.030029296875002)
    ])
    
    return (
        <SegmentProvider>
            <div className="ml-wrapper">
                <Toolbars  />
                <MapWrapper>
                    <Segments boundaries={boundaries} /> 
                    <MapEvents setBoundaries={setBoundaries}></MapEvents>        
                </MapWrapper>
            </div>
        </SegmentProvider>
    );
}

export default CarData;
    