import React, { FC, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import { LocationEvent, LatLng, LatLngExpression, LeafletMouseEvent } from 'leaflet';

import RoutingMachine from "./RoutingMachine";
import { RoadModel } from '../assets/models'

import '../css/road.css'


type Props = {
  roads: RoadModel;
};
/*
const Roads: FC<Props> = ( { roads } ) => {
    return roads.paths.map( (element: LatLng[]) => {
        return <Polyline pathOptions={{color: 'purple'}} positions={element}></Polyline>
    } );
}

export default Roads;*/
