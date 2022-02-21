import { FC } from "react";
import { MapContainer, TileLayer } from 'react-leaflet'

import { PathProps } from "../assets/models";

import '../css/map.css'
import Path from "./Renderers/Path";

const MapWrapper = ( props : any ) => { 

	const { children } = props;
	console.log(children);
	
	return (
		<MapContainer 
			preferCanvas={true}
			center={[55.6720619937223, 12.558746337890627]} 
			zoom={11} 
			scrollWheelZoom={true}>
			<TileLayer
				attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			{ children.map( (child: PathProps) => <Path key={`path${Math.random()}`} path={child.path} properties={child.properties}/>) }
		</MapContainer>
  	)
}

export default MapWrapper;
