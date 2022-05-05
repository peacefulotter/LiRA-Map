import { FC, useEffect, useState } from "react";
import '../../css/rides.css'
import { SegmentProps } from "./Segment";
import { SegmentInterface } from "../../models/models";
import Segment from "./Segment";
import { LatLng } from "leaflet";
import {GetSegmentsAndAverageValuesInAPolygon} from '../../queries/DataRequests';


export interface SegmentsProps{
    boundaries: LatLng[];
    type: string;
    aggregation: string;
    activatePopUp: (props: SegmentProps) => void
}

const Segments: FC<SegmentsProps> = ( {boundaries, type, aggregation, activatePopUp} ) => {
    const [showPopup, setShowPopup] = useState<boolean>();
    const [segments, setSegments] = useState<SegmentProps[]>([]);
    const [popUpProps, setPopUpProps] = useState<SegmentProps>();

    useEffect(() => {
        
        const fetchData = async () => {
            const segmentProps: SegmentProps[] = await getSegmentProps();
            console.log(segmentProps);
            setSegments(segmentProps);
          }
        
        fetchData()

      }, [boundaries, type, aggregation]);


    const getSegmentProps = async () => {
        let segmentProps = await GetSegmentsAndAverageValuesInAPolygon(boundaries, type, aggregation)
            .then(res => {
              return res;
            });
        return segmentProps;
    }

    const onClickSegment = (props: SegmentProps) => {
      activatePopUp(props);
    }

    return (
        <>

        { segments != undefined && segments.map( (segment:SegmentProps) => {
            return <Segment {...segment} onClick={onClickSegment}>
            </Segment> 
         } ) }
        </>
  )
}

export default Segments;