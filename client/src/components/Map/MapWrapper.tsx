import { MapContainer, TileLayer, ScaleControl } from 'react-leaflet'
import Zoom from './Zoom';

import {MAP_OPTIONS} from "./constants";

import 'leaflet/dist/leaflet.css';

const MapWrapper = ( props : any ) => {

	const { children } = props;

	const { center, zoom, minZoom, maxZoom, scaleWidth } = MAP_OPTIONS;

	return (
		<MapContainer
			style={{height: '100vh'}}
			preferCanvas={true}
			center={center}
			zoom={zoom}
			minZoom={minZoom}
			maxZoom={maxZoom}
			scrollWheelZoom={true}
			zoomControl={false} >
			<TileLayer
				attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			<Zoom />
			<ScaleControl imperial={false} position='bottomright' maxWidth={scaleWidth}/>
			{children}
		</MapContainer>
	)
}

export default MapWrapper;
