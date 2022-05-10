import { FC, useState, useEffect } from "react";
import { LatLng } from "leaflet";

import MapWrapper from "../Components/Map/MapWrapper";
import MapEvents from "../Components/CarData/MapEvents";
import Segments from "../Components/CarData/Segments";
import FilterBtn from "../Components/CarData/FilterBtn";
import { SegmentProps } from "../Components/CarData/Segment";

import { MeasurementData } from "../models/models";
import {GetSegmentsAndAverageValuesInAPolygon} from '../queries/DataRequests';

import '../css/cardata.css'

export interface SegTypes {
    dataType: string | undefined;
    aggrType: string | undefined;
}

const CarData: FC = () => {

    const [measurements, setMeasurements] = useState<MeasurementData[]>([]);
    const [segments, setSegments] = useState<SegmentProps[]>([]);
    const [boundaries, setBoundaries] = useState<LatLng[]>([
        new LatLng(55.523966596348956, 12.030029296875002),
        new LatLng(55.523966596348956, 12.74620056152344),
        new LatLng(55.8089989927049, 12.74620056152344),
        new LatLng(55.8089989927049, 12.030029296875002)
    ])
    
    const [segmentProps, setSegmentProps] = useState<SegmentProps>();
    const [types, setTypes] = useState<SegTypes>({
        dataType: undefined,
        aggrType: undefined
    })


    useEffect(() => {

        const { dataType, aggrType } = types;

        if ( dataType === undefined || aggrType === undefined )
            return 

        GetSegmentsAndAverageValuesInAPolygon(boundaries, dataType, aggrType)
            .then( setSegments )

    }, [boundaries, types]);


    const updateSegment = (props: SegmentProps) => {
        const temp = [...segments];
        const index = segments.findIndex( (segment) => segment.id === props.id )
        temp[index] = props;
        console.log('update segment', index, props, temp);
        setSegments(temp);
        activatePopUp(props);
    }

    const activatePopUp = (props: SegmentProps) => {
        console.log('activate popup', props);
        const popUpProps = {...props, updateSegment}
        setSegmentProps(popUpProps);
    }

    return (
        <div className="ml-wrapper">
            <FilterBtn 
                types={types} 
                setTypes={setTypes} 
                segmentProps={segmentProps} 
                setSegmentProps={setSegmentProps}
                updateSegment={updateSegment}
            />
            <MapWrapper>
                { segments !== undefined &&
                    <Segments segments={segments} activatePopUp={activatePopUp}/> 
                }
                <MapEvents setMeasurements={setMeasurements} setBoundaries={setBoundaries}></MapEvents>        
            </MapWrapper>
        </div>
    );
}

export default CarData;