
import { FC, useEffect, useMemo, useState } from 'react';
import { useZoom } from '../../context/ZoomContext';
import { MapConditions, Way } from '../../models/path';
import { getWays } from '../../queries/conditions';
import RCHotline from './RCHotline';

interface IWays {
    onClick: (way: Way) => () => void;
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
            console.log(data[0].conditions.length, data);
            setConditions( data.slice(0, 5) )
            setTimeout( onClick(data[0].way), 100 )
        } )
    }
    return (
        <>
        { conditions.map( (condition: MapConditions, i: number) => {
            return <RCHotline 
                key={`ml-path-${i}`}
                condition={condition}
                onClick={onClick(condition.way)}
            />
        } ) } 
        </>
    )
}

export default Ways;