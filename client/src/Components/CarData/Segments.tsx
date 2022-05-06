import { FC, useEffect, useState } from "react";
import '../../css/rides.css'
import { SegmentProps } from "./Segment";
import { SegmentInterface } from "../../models/models";
import Segment from "./Segment";
import { LatLng } from "leaflet";
import {GetSegmentsAndAverageValuesInAPolygon} from '../../queries/DataRequests';


export interface SegmentsProps{
    segments: SegmentProps[]
    activatePopUp: (props: SegmentProps) => void
}

const Segments: FC<SegmentsProps> = ( {segments, activatePopUp} ) => {
    const [showPopup, setShowPopup] = useState<boolean>();
    const [popUpProps, setPopUpProps] = useState<SegmentProps>();

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