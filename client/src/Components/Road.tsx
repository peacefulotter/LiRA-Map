import React, { FC, useState } from "react";
import { Polyline } from 'react-leaflet'
import L, { LatLng } from 'leaflet';

import RoutingMachine from "./RoutingMachine";
import { RoadModel } from '../assets/models'

import '../css/road.css'


type Props = {
  roads: RoadModel;
};

const Roads: FC<Props> = ( { roads } ) => {
  console.log(roads.paths);
  
    return (<>
      {
         roads.paths.map( (element: LatLng[], i: number) => {
           let a = <Polyline key={`line${i}`} pathOptions={{color: 'red'}} positions={element}></Polyline>
           console.log(a);
           // let path: LatLng[] = [L.latLng(element[0][0], element[0][1]), L.latLng(element[1][0], element[1][1])]
           
          return <Polyline key={`line${i}`} pathOptions={{color: 'red'}} positions={element}></Polyline>
      } )
      }
    </>)
   
}

export default Roads;
