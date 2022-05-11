import { FC, useState, useEffect } from "react";
import { LatLng } from "leaflet";

import MapWrapper from "../Components/Map/MapWrapper";
import MapEvents from "../Components/CarData/MapEvents";
import Segments from "../Components/CarData/Segments";
import Toolbars from "../Components/CarData/toolbar/Toolbars";

import { Segment } from "../models/segment";
import {GetSegmentsAndAverageValuesInAPolygon} from '../queries/DataRequests';
import { SegmentProvider, useSegment } from "../context/SegmentContext";


export interface SegTypes {
    dataType: string | undefined;
    aggrType: string | undefined;
}

const CarData: FC = () => {

    const [boundaries, setBoundaries] = useState<LatLng[]>([
        new LatLng(55.523966596348956, 12.030029296875002),
        new LatLng(55.523966596348956, 12.74620056152344),
        new LatLng(55.8089989927049, 12.74620056152344),
        new LatLng(55.8089989927049, 12.030029296875002)
    ])
    
    const [segments, setSegments] = useState<Segment[]>([])
    const { pathTypes } = useSegment();


    useEffect(() => {

        const { dataType, aggrType } = pathTypes;

        if ( dataType === undefined || aggrType === undefined )
            return 

        GetSegmentsAndAverageValuesInAPolygon(boundaries, dataType, aggrType)
            .then( setSegments )

    }, [boundaries, pathTypes]);


    return (
        <div className="ml-wrapper">
            <Toolbars  />
            <MapWrapper>
                <Segments segments={segments} /> 
                <MapEvents setBoundaries={setBoundaries}></MapEvents>        
            </MapWrapper>
        </div>
    );
}


export default ( props: any ) => 
    <SegmentProvider>
        <CarData {...props} />
    </SegmentProvider>;