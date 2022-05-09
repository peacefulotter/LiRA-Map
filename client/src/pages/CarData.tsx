import { FC, useState, useEffect } from "react";
import { LatLng } from "leaflet";

import MapWrapper from "../Components/Map/MapWrapper";
import MapEvents from "../Components/CarData/MapEvents";
import Segments from "../Components/CarData/Segments";
import Filter from "../Components/CarData/Filter";
import SegmentPopup from "../Components/CarData/SegmentPopup";
import { SegmentProps } from "../Components/CarData/Segment";
import { SegmentPopUpProps } from "../Components/CarData/SegmentPopup";

import { MeasurementData } from "../models/models";
import {GetSegmentsAndAverageValuesInAPolygon} from '../queries/DataRequests';

import '../css/cardata.css'

const CarData: FC = () => {

    const [measurements, setMeasurements] = useState<MeasurementData[]>([]);
    const [segments, setSegments] = useState<SegmentProps[]>([]);
    const [boundaries, setBoundaries] = useState<LatLng[]>([
        new LatLng(55.523966596348956, 12.030029296875002),
        new LatLng(55.523966596348956, 12.74620056152344),
        new LatLng(55.8089989927049, 12.74620056152344),
        new LatLng(55.8089989927049, 12.030029296875002)
    ])
    const [dataType, setDataType] = useState<string>();
    const [aggregationType, setAggregationType] = useState<string>();
    const [showSegmentPopUp, setShowSegmentPopUp] = useState<[boolean, SegmentPopUpProps]>();


    useEffect(() => {

        if ( dataType === undefined || aggregationType === undefined )
            return 

        GetSegmentsAndAverageValuesInAPolygon(boundaries, dataType, aggregationType)
            .then( segmentProps => {
                console.log(segmentProps);
                setSegments(segmentProps);
            })

    }, [boundaries, dataType, aggregationType]);



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
        setShowSegmentPopUp([true, popUpProps]);
    }


    return (
        <>
            <div className="ml-wrapper">
                <Filter setPropsAggrType={setAggregationType} setPropsDataType={setDataType}></Filter>
                <MapWrapper>
                    {showSegmentPopUp !== undefined && showSegmentPopUp[0] && 
                        <SegmentPopup {...showSegmentPopUp[1]}></SegmentPopup>
                    }
                    {segments !== undefined &&
                        <Segments segments={segments} activatePopUp={activatePopUp}/> 
                    }
                    <MapEvents setMeasurements={setMeasurements} setBoundaries={setBoundaries}></MapEvents>        
                </MapWrapper>
            </div>
        </>
        
    );
}

export default CarData;