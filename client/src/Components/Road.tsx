import React, { FC } from "react";
import { Polyline, Circle } from 'react-leaflet'

import { RoadSegments, RoadSegment } from '../assets/models'

import '../css/road.css'


type Props = {
  roadSegments: RoadSegments;
};

const Roads: FC<Props> = ( { roadSegments } ) => {  
	let p = roadSegments[0].path
    return <> { 
		p.map( (pos: any, i: number) => {			
			return <Circle center={[pos.lat, pos.lng]} radius={1} />
		} ) } </>
}

export default Roads;
