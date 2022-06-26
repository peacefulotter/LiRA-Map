
import { FC, useEffect, useState } from 'react';
import { TRGB } from 'react-gradient-hook/lib/types';
import { HotlineOptions } from 'react-leaflet-hotline';
import { useGraph } from '../../context/GraphContext';
import { useZoom } from '../../context/ZoomContext';
import { WaysConditions } from '../../models/path';
import { getWaysConditions } from '../../queries/conditions';
import useMapBounds from '../Map/Hooks/useMapBounds';
import DistHotline from '../Map/Renderers/DistHotline';

interface IWays {
    palette: TRGB[]
    type: string;
    onClick?: (way_id: string, way_length: number) => () => void;
}

const Ways: FC<IWays> = ( { palette, type, onClick } ) => {
    
    const { zoom } = useZoom();
    const { minY, maxY } = useGraph()

    const [ways, setWays] = useState<WaysConditions>()
    const [options, setOptions] = useState<HotlineOptions>({});

    useEffect( () => {
        setOptions( { palette, min: minY, max: maxY } )
    }, [palette, minY, maxY])

    useEffect( () => {
        const z = Math.max(0, zoom - 12)
        getWaysConditions(type, z, (data: WaysConditions) => {
            console.log(data);
            setWays( data )
            if ( onClick )
                setTimeout( onClick(data.way_ids[0], data.way_lengths[0]), 100 )
        } )
    }, [zoom] )

    return (
        <>
        { ways 
            ? <DistHotline 
                way_ids={ways.way_ids}
                geometry={ways.geometry}
                conditions={ways.conditions} 
                options={options} /> 
            : null 
        }
        </>
    )
}

export default Ways;