import React, { FC, useState } from "react";
import { Polyline } from 'react-leaflet'
import L, { LatLng } from 'leaflet';

import RoutingMachine from "./RoutingMachine";
import { RoadSegments, RoadSegment } from '../assets/models'

import '../css/road.css'


type Props = {
  roadSegments: RoadSegments;
};

const Roads: FC<Props> = ( { roadSegments } ) => {  
    return <> { 
		roadSegments.map( (seg: RoadSegment, i: number) => {			
			return <Polyline 
						key={`line${i}`} 
						pathOptions={i ? {color: 'red'} : {color: 'blue'}} 
						positions={seg.path}>	
					</Polyline>
		} ) } </>
}

export default Roads;
