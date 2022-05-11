import { FC } from "react";

import SegmentPath from "./SegmentPath";
import { useSegment } from "../../context/SegmentContext";
import { Segment } from "../../models/segment";

import '../../css/rides.css'

export interface SegmentsProps{
    segments: Segment[]
}

const Segments: FC<SegmentsProps> = ( { segments } ) => {

    const { setSegment } = useSegment()

    const onClickSegment = (seg: Segment) => () => () => {
        setSegment(seg)
    }

    return (
        <>
        { segments.map( (segment: Segment, i: number) =>
            <SegmentPath
                key={`segment-${i}`} 
                segment={segment} 
                onClick={onClickSegment} 
            />
        ) }
        </>
    )
}

export default Segments;