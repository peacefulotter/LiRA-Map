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
    direction: number | undefined;
}

const CarData: FC = () => {

    const [boundaries, setBoundaries] = useState<LatLng[]>([
        new LatLng(55.523966596348956, 12.030029296875002),
        new LatLng(55.523966596348956, 12.74620056152344),
        new LatLng(55.8089989927049, 12.74620056152344),
        new LatLng(55.8089989927049, 12.030029296875002)
    ])
    
    const [segments, setSegments] = useState<Segment[]>([])
    const { pathTypes, pathDirection } = useSegment();


    useEffect(() => {

        const { dataType, aggrType} = pathTypes;
        const direction = pathDirection;
        console.log(direction)
        
        if ( dataType === undefined || aggrType === undefined || direction === undefined )
            return 

        GetSegmentsAndAverageValuesInAPolygon(boundaries, dataType, aggrType, direction)
            .then( setSegments )
    }, [boundaries, pathTypes, pathDirection]);


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