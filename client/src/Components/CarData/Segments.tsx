import { FC, useEffect, useState } from "react";
import { LatLng } from "leaflet";

import SegmentPath from "./SegmentPath";
import { useSegment } from "../../context/SegmentContext";
import { Segment } from "../../models/segment";

import { GetSegmentsAndAverageValuesInAPolygon } from "../../queries/DataRequests";

import '../../css/rides.css'

interface ISegments {
    boundaries: LatLng[]
}

const Segments: FC<ISegments> = ( { boundaries } ) => {

    const [segments, setSegments] = useState<Segment[]>([])

    const { pathTypes, pathDirection, setSegment } = useSegment()

    useEffect(() => {

        const { dataType, aggrType} = pathTypes;

        if ( dataType === undefined || aggrType === undefined || pathDirection === undefined )
            return 

        GetSegmentsAndAverageValuesInAPolygon(boundaries, dataType.id, aggrType.id, pathDirection)
            .then( setSegments )

    }, [boundaries, pathTypes, pathDirection]);


    const getMaxAndMinValue = () => {

        var max_value:number = -1;
        var min_value:number = -1;

        segments.forEach(segment => {
            if(segment.value == undefined)
                return;

            if(min_value === -1 || segment.value < min_value){
                min_value = segment.value;
            }

            if(max_value === -1 || segment.value > max_value){
                max_value = segment.value;
            }
        });

        return [max_value, min_value]
    }


    const onClick = (seg: Segment) => () => () => setSegment(seg)

    const [max_value, min_value] = getMaxAndMinValue();

    return (
        <>
        { segments.map( (seg: Segment, i: number) =>
            <SegmentPath
                key={`segment-${i}`} 
                i={i}
                seg={seg} 
                onClick={onClick(seg)}
                max_value = {max_value}
                min_value = {min_value} 
            />
        ) }
        </>
    )
}

export default Segments;