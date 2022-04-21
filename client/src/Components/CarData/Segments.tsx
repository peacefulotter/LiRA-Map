import { FC, useState } from "react";
import {Marker, Popup, PopupProps} from "react-leaflet"

import { SegmentsProps, SegmentProps } from '../../models/models';
import Path from "../Map/Path";
import { PathEventHandler } from "../../models/renderers";
import Segment from "./Segment";
import '../../css/rides.css'
import SegmentPopup from "./SegmentPopup";
import { popup } from "Leaflet.MultiOptionsPolyline";


const Segments: FC<SegmentsProps> = ( { segments } ) => {
    const [showPopup, setShowPopup] = useState<boolean>();
    const [popUpProps, setPopUpProps] = useState<SegmentProps>();

    const activatePopup = (segment:SegmentProps) => {
        setShowPopup(true)
        setPopUpProps(segment);
    }

    return (
        <>
        {showPopup == true && popUpProps != undefined && 
            <SegmentPopup {...popUpProps}>
            </SegmentPopup>
        }
        { segments.map( segment =>{
            return <Segment {...segment} function={activatePopup} >


            </Segment> 
            
         } ) }
        </>
  )
}

export default Segments;