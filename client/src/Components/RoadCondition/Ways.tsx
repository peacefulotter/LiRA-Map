
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
    const [conditions, setConditions] = useState<MapConditions[]>([])

    useEffect( () => {
        fetchWays()
    }, [zoom] )

    // const addPath = (i: number) => {
    //     post('/conditions/file', { filename: measurements[i] }, (json: MapConditions) => {
    //         setConditions( prev => [...prev, json] )
    //     } )
    // }

    const fetchWays = () => {
        const roadName = 'M3'
        const type = 'IRI';
        const z = Math.max(0, zoom - 12)
        console.log(z);
        
        getWays(roadName, type, z, (data: MapConditions[]) => {
            const { way_id, way_length, conditions } = data[0]
            console.log(conditions.length, data);
            setConditions( data.slice(1, 2) )
            setTimeout( onClick(way_id, way_length), 100 )
        } )
    }
    return (
        <>
        { conditions.map( ({way_id, way_length, nodes, conditions, properties}: MapConditions, i: number) => {
            return <RCHotline 
                key={`ml-path-${i}`}
                nodes={nodes}
                conditions={conditions}
                properties={properties}
                onClick={onClick(way_id, way_length)}
            />
        } ) } 
        </>
    )
}

export default Ways;