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
  console.log(roadSegments);
  
    return (<>
      {
         roadSegments.map( (seg: RoadSegment, i: number) => {
           let a = <Polyline key={`line${i}`} pathOptions={{color: 'red'}} positions={seg.path}></Polyline>
           console.log(a);
           // let path: LatLng[] = [L.latLng(element[0][0], element[0][1]), L.latLng(element[1][0], element[1][1])]
           
          return <Polyline key={`line${i}`} pathOptions={{color: 'red'}} positions={seg.path}></Polyline>
      } )
      }
    </>)
   
}

export default Roads;
