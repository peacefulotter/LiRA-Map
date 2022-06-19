import { Dispatch, SetStateAction,FC, useEffect, useState } from "react";

import { SegTypes } from "../../../pages/CarData";

import { Segment } from "../../../models/segment";
import { GetSegmentAndAggregateValue } from "../../../queries/DataRequests";


import '../../../css/popupsegment.css'
import '../../../css/rides.css'


export interface ISegmentPopup {
    segment: Segment
    types: SegTypes;
    direction: number;
    setSegment: Dispatch<SetStateAction<Segment | undefined>>;
}

const SegmentPopup: FC<ISegmentPopup> = ( { segment, types, direction, setSegment } ) => {

    const [isValueDefined, setIsValueDefined] = useState<boolean>(true)
    const { id, way, value} = segment;
    const { dataType, aggrType } = types;
    

    useEffect( () => {
        
        if ( id === undefined || dataType === undefined || aggrType === undefined ) return;
        GetSegmentAndAggregateValue(dataType.id, aggrType.id, id, direction)
            .then(res => {
                if(res.length !== 0){
                    setSegment(res[0]);
                    setIsValueDefined(true);
                }
                else
                    setIsValueDefined(false);
            })
        
    }, [id, dataType, aggrType, direction])
    console.log(dataType)
  
    return (
        <div className="seg-popup-container">
            <div className="seg-popup-section seg-center-section">
                <div className="seg-title">Segment: <b>{id}</b></div>
                <div className="seg-title">Way: <b>{way}</b></div>
            </div>
            <div className="seg-popup-section seg-center-section">
                {isValueDefined === true && 
                    <div className="seg-data">{value} {dataType?.units}</div>
                }
                {isValueDefined === false && 
                    <div className="seg-data">No data available!</div>
                }
                
            </div>
        </div>
    );
    

}

export default SegmentPopup;