import { FC, useState, useEffect } from "react";
import { LatLng } from "leaflet";
import {GiDirectionSigns} from "react-icons/gi";
import { FaDirections } from "react-icons/fa";
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
    const { pathTypes } = useSegment();


    useEffect(() => {

        const { dataType, aggrType, direction} = types;
        
        if ( dataType === undefined || aggrType === undefined || direction === undefined )
            return 

        GetSegmentsAndAverageValuesInAPolygon(boundaries, dataType, aggrType, direction)
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

    const activateDirection = () => {
        const {dataType, aggrType, direction} = types;
        if(direction === -1){
            setTypes({dataType, aggrType, direction: 0});
        }
        else{
            setTypes({dataType, aggrType, direction: -1});
        }
    }

    const switchDirection = () => {
        const {dataType, aggrType, direction} = types;
        if(direction === 0){
            setTypes({dataType, aggrType, direction: 1});
        }
        else{
            setTypes({dataType, aggrType, direction: 0});
        }
    }

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