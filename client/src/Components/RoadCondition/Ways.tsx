
import { FC, useEffect, useState } from 'react';
import { TRGB } from 'react-gradient-hook/lib/types';
import { Hotline, HotlineOptions } from 'react-leaflet-hotline';
import { useGraph } from '../../context/GraphContext';
import { useZoom } from '../../context/ZoomContext';
import { Node, WaysConditions } from '../../models/path';
import { getWaysConditions } from '../../queries/conditions';
import useMapBounds from '../Map/Hooks/useMapBounds';
import DistHotline from '../Map/Renderers/DistHotline';

interface IWays {
    palette: TRGB[]
    type: string;
    onClick?: (way_id: string, way_length: number) => void;
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
        if ( zoom === 0 ) return;
        getWaysConditions(type, zoom - 12, (data: WaysConditions) => {
            console.log(data, onClick)
            setWays( data )
            console.log(data.way_ids[0], data.way_lengths[0]);
            if ( onClick )
                onClick(data.way_ids[0], data.way_lengths[0])
        } )
    }, [zoom] )

    return (
        <>
        { ways 
            ? <DistHotline 
                way_ids={ways.way_ids}
                geometry={ways.geometry}
                conditions={ways.conditions} 
                options={options} 
                eventHandlers={{
                    click: (_, i) => onClick && onClick(ways.way_ids[i], ways.way_lengths[i])
                }}/> 
            : null 
        }
        </>
    )
}

export default Ways;