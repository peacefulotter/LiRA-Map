import { Dispatch, SetStateAction,FC, useEffect } from "react";

import { SegTypes } from "../../../pages/CarData";

import { GetSegmentAndAggregateValue } from "../../../queries/DataRequests";
import { Segment } from "../../../models/segment";

import '../../../css/popupsegment.css'
import '../../../css/rides.css'


export interface ISegmentPopup {
    segment: Segment
    types: SegTypes;
    direction: number;
    setSegment: Dispatch<SetStateAction<Segment | undefined>>;
}

const SegmentPopup: FC<ISegmentPopup> = ( { segment, types, direction,setSegment } ) => {

    const { id, way, value} = segment;
    const { dataType, aggrType } = types;

    useEffect( () => {
        if ( id === undefined || dataType === undefined || aggrType === undefined ) return;
        console.log(direction)
        GetSegmentAndAggregateValue(dataType, aggrType, id, direction)
            .then( setSegment )
    }, [id, dataType, aggrType, direction])

    return (
        <div className="seg-popup-container">
            <div className="seg-popup-section seg-center-section">
                <div className="seg-title">Segment: <b>{id}</b></div>
                <div className="seg-title">Way: <b>{way}</b></div>
            </div>
            <div className="seg-popup-section seg-center-section">
                <div className="seg-data">{value} Newtons</div>
            </div>
        </div>
    );
}

export default SegmentPopup;