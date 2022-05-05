import { FC, useState, useEffect } from "react";
import { Marker } from 'react-leaflet'

import '../../css/rides.css'
import '../../css/popupsegment.css'
import { SegmentProps } from "./Segment";


const SegmentPopup: FC<SegmentProps> = ({id, positionA, positionB, way, count, type, aggregation, value}) => {


    useEffect(() => {
        
    }, [id]);

    return(
        <div className="container-segment">
            <div className="content-segment">
                <div className="section">
                    <div className="subsection-segment">
                        <span className="title">Segment {id}</span>
                    </div>
                    <div className="subsection">
                        <span className="way">Way {way}</span>
                    </div>
                </div>
                <div className="section">
                    <div className="subsection">
                        <span className="data">Average Traction Force:</span>
                    </div>
                    <div className="subsection">
                        <span className="value">{value} Newtons</span>
                    </div>
                </div>
                <span className="data">More data types</span>
                <div className="dataScrollable">
                    <div className="scrollableItem">
                        Inertial Force
                    </div>
                    <div className="scrollableItem">
                        Traction Force
                    </div>
                    <div className="scrollableItem">
                        Inertial Force
                    </div>
                    <div className="scrollableItem">
                        Traction Force
                    </div>
                    <div className="scrollableItem">
                        Inertial Force
                    </div>
                    <div className="scrollableItem">
                        Traction Force
                    </div>
                </div>
                <span className="data">More aggregations</span>
                <div className="dataScrollable">
                    <div className="scrollableItem">
                        Inertial Force
                    </div>
                    <div className="scrollableItem">
                        Traction Force
                    </div>
                    <div className="scrollableItem">
                        Inertial Force
                    </div>
                    <div className="scrollableItem">
                        Traction Force
                    </div>
                    <div className="scrollableItem">
                        Inertial Force
                    </div>
                    <div className="scrollableItem">
                        Traction Force
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SegmentPopup;