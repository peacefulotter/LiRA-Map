import { FC, useState, useEffect } from "react";
import { LatLng } from "leaflet";
import {GiDirectionSigns} from "react-icons/gi";
import MapWrapper from "../Components/Map/MapWrapper";
import MapEvents from "../Components/CarData/MapEvents";
import Segments from "../Components/CarData/Segments";
import Filter from "../Components/CarData/Filter";
import SegmentPopup from "../Components/CarData/SegmentPopup";
import { SegmentProps } from "../Components/CarData/Segment";
import { SegmentPopUpProps } from "../Components/CarData/SegmentPopup";
import '../css/filter.css'

import {GetSegmentsAndAverageValuesInAPolygon} from '../queries/DataRequests';

import '../css/cardata.css'

export interface SegTypes {
    dataType: string | undefined;
    aggrType: string | undefined;
    direction: number | undefined;
}

const CarData: FC = () => {

    const [segments, setSegments] = useState<SegmentProps[]>([]);
    const [boundaries, setBoundaries] = useState<LatLng[]>([
        new LatLng(55.523966596348956, 12.030029296875002),
        new LatLng(55.523966596348956, 12.74620056152344),
        new LatLng(55.8089989927049, 12.74620056152344),
        new LatLng(55.8089989927049, 12.030029296875002)
    ])
    
    const [types, setTypes] = useState<SegTypes>({
        dataType: undefined,
        aggrType: undefined,
        direction: undefined
    })

    const [showSegmentPopUp, setShowSegmentPopUp] = useState<[boolean, SegmentPopUpProps]>();


    useEffect(() => {

        const { dataType, aggrType, direction} = types;
        
        if ( dataType === undefined || aggrType === undefined || direction === undefined )
            return 

        GetSegmentsAndAverageValuesInAPolygon(boundaries, dataType, aggrType, direction)
            .then( segmentProps => {
                console.log(segmentProps);
                setSegments(segmentProps);
            })

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
        setShowSegmentPopUp([true, popUpProps]);
    }


    return (
        <>
            <div className="ml-wrapper">
                <div className="toolBar">
                    <Filter setTypes={setTypes}></Filter>
                    <GiDirectionSigns className="toolbar-button"></GiDirectionSigns>
                </div>
                
                <MapWrapper>
                    {showSegmentPopUp !== undefined && showSegmentPopUp[0] && 
                        <SegmentPopup {...showSegmentPopUp[1]}></SegmentPopup>
                    }
                    {segments !== undefined &&
                        <Segments segments={segments} activatePopUp={activatePopUp}/> 
                    }
                    <MapEvents setBoundaries={setBoundaries}></MapEvents>        
                </MapWrapper>
            </div>
        </>
        
    );
}

export default CarData;