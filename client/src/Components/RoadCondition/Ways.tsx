
import { FC, useEffect, useState } from 'react';
import { useZoom } from '../../context/ZoomContext';
import { MapConditions } from '../../models/path';
import { getWays } from '../../queries/conditions';
import RCHotline from './RCHotline';

interface IWays {
    onClick: (way_id: string, way_length: number) => () => void;
}

const Ways: FC<IWays> = ( { onClick } ) => {
    
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
            // setTimeout( onClick(way_ids[0], way_lengths[0]), 100 )
        } )
    }
    
    return (
        <>
        {/* { conditions.map( ({way_id, way_length, nodes, conditions, properties}: MapConditions, i: number) => {
            return <RCHotline 
                key={`ml-path-${i}`}
                nodes={nodes}
                conditions={conditions}
                properties={properties}
                onClick={onClick(way_id, way_length)}
            />
        } ) }  */}
    
        {
            mcs
                ? <RCHotline mcs={mcs} />
                : null
        }
        </>
    )
}

export default Ways;