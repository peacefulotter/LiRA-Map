
import { FC, useEffect, useState } from 'react';
import { TRGB } from 'react-gradient-hook/lib/types';
import { useZoom } from '../../context/ZoomContext';
import { MapConditions } from '../../models/path';
import { getWays } from '../../queries/conditions';
import RCHotline from './RCHotline';

interface IWays {
    palette: TRGB[]
    onClick?: (way_id: string, way_length: number) => () => void;
}

const Ways: FC<IWays> = ( { palette, onClick } ) => {
    
    const { zoom } = useZoom();
    const [mcs, setMCs] = useState<MapConditions>()

    useEffect( () => {
        fetchWays()
    }, [zoom] )

    const fetchWays = () => {
        const roadName = 'M3'
        const type = 'IRI';
        const z = Math.max(0, zoom - 12)
        
        getWays(roadName, type, z, (data: MapConditions) => {
            console.log(data);
            setMCs( data )
            const [way_id, way] = Object.entries(data)[1]
            if ( onClick )
                setTimeout( onClick(way_id, way.way_length), 100 )
        } )
    }
    
    return (
        <>
        { mcs ? <RCHotline mcs={mcs} palette={palette} /> : null }
        </>
    )
}

export default Ways;