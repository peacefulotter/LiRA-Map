
import { FC, useCallback, useEffect, useState } from 'react';
import { TRGB } from 'react-gradient-hook/lib/types';
import { HotlineOptions } from 'react-leaflet-hotline';
import { useGraph } from '../../context/GraphContext';
import { WaysConditions } from '../../models/path';
import { getWaysConditions } from '../../queries/conditions';
import useZoom from '../Map/Hooks/useZoom';
import DistHotline from '../Map/Renderers/DistHotline';

interface IWays {
    palette: TRGB[]
    type: string;
    onClick?: (way_id: string, way_length: number) => void;
}

const Ways: FC<IWays> = ( { palette, type, onClick } ) => {
    
    const zoom = useZoom();
    const { minY, maxY } = useGraph()

    const [ways, setWays] = useState<WaysConditions>()
    const [options, setOptions] = useState<HotlineOptions>({});

    useEffect( () => {
        setOptions( { palette, min: minY, max: maxY } )
    }, [palette, minY, maxY])

    useEffect( () => {
        if ( zoom === undefined ) return;
        const z = Math.max(0, zoom - 12)
        getWaysConditions(type, z, (data: WaysConditions) => {
            console.log(data)
            setWays( data )
        } )
    }, [zoom] )

    const onHotlineClick = useCallback( (_, i) => {
        if ( ways && onClick )
            onClick(ways.way_ids[i], ways.way_lengths[i])
    }, [ways] )

    return (
        <>
        { ways 
            ? <DistHotline 
                way_ids={ways.way_ids}
                geometry={ways.geometry}
                conditions={ways.conditions} 
                options={options} 
                eventHandlers={{click: onHotlineClick}}/> 
            : null 
        }
        </>
    )
}

export default Ways;