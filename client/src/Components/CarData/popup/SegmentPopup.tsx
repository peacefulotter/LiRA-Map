import { FC } from "react";

import { SegTypes } from "../../../pages/CarData";

import { Segment } from "../../../models/segment";

import '../../../css/popupsegment.css'
import '../../../css/rides.css'


export interface ISegmentPopup {
    segment: Segment
    types: SegTypes;
    direction: number;
}

const SegmentPopup: FC<ISegmentPopup> = ( { segment, types, direction } ) => {

    const { id, way, value } = segment;

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