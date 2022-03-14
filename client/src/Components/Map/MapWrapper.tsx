
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet'

import '../../css/map.css'
import MapEvents from './MapEvents';


const MapWrapper = ( props : any ) => { 

	const { children } = props;
	
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
			<MapEvents />
			{ children }
		</MapContainer>
  	)
}

export default MapWrapper;
