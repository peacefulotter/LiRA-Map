import { FC, useState } from "react";
import Segment, { SegmentProps } from "./Segment";

import '../../css/rides.css'

export interface SegmentsProps{
    segments: SegmentProps[]
    activatePopUp: (props: SegmentProps) => void
}

const Segments: FC<SegmentsProps> = ( {segments, activatePopUp} ) => {

    const onClickSegment = (props: SegmentProps) => activatePopUp(props);

    return (
        <>
        { segments != undefined && segments.map( (segment: SegmentProps, i: number) =>
            <Segment 
				{...segment} 
				key={`segment-${i}`} 
				onClick={onClickSegment} 
			/>
        ) }
        </>
  )
}

export default Segments;