import { FC, useState, useEffect } from "react";
import { MeasurementData, SegmentInterface} from "../models/models";
import '../css/cardata.css'
import filter_image from "../assets/images/filter.png";


import MapWrapper from "../Components/Map/MapWrapper";
import MapEvents from "../Components/CarData/MapEvents";
import Measurements from "../Components/CarData/Measurements";
import Segments, { SegmentsProps } from "../Components/CarData/Segments";
import { LatLng } from "leaflet";
import Filter from "../Components/CarData/Filter";
import SegmentPopup from "../Components/CarData/SegmentPopup";
import { SegmentProps } from "../Components/CarData/Segment";
import { SegmentPopUpProps } from "../Components/CarData/SegmentPopup";
import {GetSegmentsAndAverageValuesInAPolygon} from '../queries/DataRequests';

const CarData: FC = () => {

    const [measurements, setMeasurements] = useState<MeasurementData[]>([]);
    const [segments, setSegments] = useState<SegmentProps[]>([]);
    const [boundaries, setBoundaries] = useState<LatLng[]>(
        [new LatLng(55.523966596348956, 12.030029296875002),
        new LatLng(55.523966596348956, 12.74620056152344),
        new LatLng(55.8089989927049, 12.74620056152344),
        new LatLng(55.8089989927049, 12.030029296875002)])
    const [dataType, setDataType] = useState<string>();
    const [aggregationType, setAggregationType] = useState<string>();
    const [showFilter, setShowFilter] = useState<Boolean>(false);
    const [showSegmentPopUp, setShowSegmentPopUp] = useState<[Boolean, SegmentPopUpProps]>();


    useEffect(() => {
        
        const fetchData = async () => {
            const segmentProps: SegmentProps[] = await getSegmentProps();
            console.log(segmentProps);
            setSegments(segmentProps);
          }
        
        fetchData()

      }, [boundaries, dataType, aggregationType]);


    const getSegmentProps = async () => {
        let segmentsProps:SegmentProps[] = [];
        if(dataType != undefined && aggregationType != undefined){
            segmentsProps = await GetSegmentsAndAverageValuesInAPolygon(boundaries, dataType, aggregationType)
                .then(res => {
                    return res;
                });
        }
        return segmentsProps;
    }


    const filterButtonOnClick = (e:any) => {
        setShowFilter(!showFilter);
    }

    const updateSegment = (props: SegmentProps) => {
        let currentSegments = segments;
        let index = currentSegments.findIndex((segment) => {
            return segment.id == props.id;
        })
        currentSegments[index] = props;
        setSegments(currentSegments);
        activatePopUp(currentSegments[index]);
    }

    const activatePopUp = (props: SegmentProps) => {

        let popUpProps = {...props, updateSegment}
        setShowSegmentPopUp([true, popUpProps]);
    }


    return (
        <>
            <div className="ml-wrapper">
                {showFilter == true &&
                    <Filter setShowFilter = {setShowFilter} setSelectedAggregation={setAggregationType} setSelectedDataType={setDataType}></Filter>
                }
                <MapWrapper>
                    {showSegmentPopUp != undefined && showSegmentPopUp[0] && 
                        <SegmentPopup {...showSegmentPopUp[1]}></SegmentPopup>
                    }
                    <img onClick={((e) => filterButtonOnClick(e))} className = "filter-button" src={filter_image} alt="" />
                    {segments != undefined &&
                        <Segments segments={segments} activatePopUp={activatePopUp}/> 
                    }
                    <MapEvents setMeasurements={setMeasurements} setBoundaries={setBoundaries}></MapEvents>        
                </MapWrapper>
            </div>
        </>
        
    );
}

export default CarData;