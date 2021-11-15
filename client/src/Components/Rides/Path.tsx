import { FC } from "react";
import { LatLng } from 'leaflet'
import { Circle } from 'react-leaflet'

import { RidePos, Measurements } from '../../assets/models'


type Props = {
	path: RidePos;
    measurement: Measurements;
};


const Path: FC<Props> = ( { path, measurement } ) => {
    return ( <> 
        { path.map( (pos: LatLng, i: number ) => {
            return <Circle center={[pos.lat, pos.lng]} radius={1} key={'circle' + i} />
        })}
    </> )
}

export default Path;
