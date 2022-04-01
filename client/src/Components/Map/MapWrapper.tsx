
import { MapContainer, TileLayer } from 'react-leaflet'

import '../../css/map.css'


const MapWrapper = ( props : any ) => { 

	const { children } = props;
	
	return (
		<MapContainer 
			preferCanvas={true}
			center={[55.7009876,12.5652333]} 
			zoom={18} 
			scrollWheelZoom={true}>
			<TileLayer
				attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			{ children }
		</MapContainer>
  	)
}

export default MapWrapper;
