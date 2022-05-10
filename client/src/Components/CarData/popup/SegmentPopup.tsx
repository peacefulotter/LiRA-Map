import { FC, useEffect } from "react";

import { SegTypes } from "../../../pages/CarData";
import { SegmentProps } from "../Segment";
import Checkbox from "../../Checkbox";

import { GetSegmentAndAggregateValue } from "../../../queries/DataRequests";

import '../../../css/popupsegment.css'
import '../../../css/rides.css'


export interface ISegmentPopup {
    segmentProps: SegmentProps
    updateSegment:(props: SegmentProps) => void;
    types: SegTypes;
}

const SegmentPopup: FC<ISegmentPopup> = ( { segmentProps, types, updateSegment } ) => {

    const { dataType, aggrType } = types;
    const { id, positionA, positionB, way, count, value, direction } = segmentProps
    // const [_segmentProps, _setSegmentProps] = useState<SegmentProps>(segmentProps);

    useEffect(() => {
        console.log("fetching new data types; id:", id, '- dataType:', dataType, '- aggrType:', aggrType, '- direction:', direction);
        // _setSegmentProps( { id, positionA, positionB, way, count, value, direction } )
    }, [id, positionA, positionB, way, count, dataType, aggrType, value, direction]);

    useEffect( () => {
        if ( segmentProps === undefined || dataType === undefined || aggrType === undefined ) return;
        GetSegmentAndAggregateValue(dataType, aggrType, segmentProps?.id)
            // .then( _setSegmentProps )
    }, [dataType, aggrType])


    const activateDirection = () => {
        updateSegment({id, positionA, positionB, way, count, value, direction:0})
    }

    const switchDirection = () => {

    }

    return (
        <div className="seg-popup-container">
            <div className="seg-popup-section seg-center-section">
                <div className="seg-title">Segment: <b>{segmentProps?.id}</b></div>
                <div className="seg-title">Way: <b>{segmentProps?.way}</b></div>
            </div>
            <div className="seg-popup-section seg-center-section">
                <Checkbox html={<p>Activate direction</p>} className='seg-checkbox' onClick={activateDirection}/>
                <Checkbox html={<p>Switch direction</p>} className='seg-checkbox' onClick={switchDirection}/>
            </div>  
            <div className="seg-popup-section seg-center-section">
                <div className="seg-data">Direction: {segmentProps?.direction}</div>
                <div className="seg-data">{segmentProps?.value} Newtons</div>
            </div>
        </div>
    );
}

export default SegmentPopup;