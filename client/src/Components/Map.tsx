import { FC } from "react";
import { MapContainer, TileLayer } from 'react-leaflet'

import { PathProps } from "../assets/models";

import '../css/map.css'
import Path from "./Renderers/Path";


type Props = {
	paths: PathProps[]; // rides or paths
};

const getKey = () => `path${Math.random()}`

const MapWrapper: FC<Props> = ( { paths } ) => { 
	
	console.log(paths);
   
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
			{ paths.map( p => <Path key={getKey()} path={p.path} properties={p.properties} />) }
		</MapContainer>
  	)
}

export default MapWrapper;
