
import { RoadSegments } from './models';
import { LatLng } from 'leaflet'

const roadStatusToCoords = ( roadSegments: RoadSegments ) => {
    const segments = roadSegments.length;
    let roadCoords: LatLng[] = []

    for (let i = 0; i < segments; i++) 
    {
        const segment = roadSegments[ i ];
        roadCoords.push( segment.path[ 0 ], segment.path[ 1 ] )
    }
        
    return roadCoords;
}

export { roadStatusToCoords };