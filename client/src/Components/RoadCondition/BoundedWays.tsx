
import { FC, useEffect, useState } from 'react';
import { TRGB } from 'react-gradient-hook/lib/types';
import { Hotline, HotlineOptions } from 'react-leaflet-hotline';
import { LatLngBounds } from 'leaflet';

import { useGraph } from '../../context/GraphContext';
import { useZoom } from '../../context/ZoomContext';

import { Node, WaysConditions } from '../../models/path';

import { getBoundedWaysConditions } from '../../queries/conditions';

import DistHotline from '../Map/Renderers/DistHotline';
import WithBounds from '../Map/WithBounds';
import { toMapBounds } from '../Map/utils';

interface IWays {
    palette: TRGB[]
    type: string;
    onClick?: (way_id: string, way_length: number) => () => void;
}

 const BoundedWays: FC<IWays> = ( { palette, type, onClick } ) => {
    
    const { zoom } = useZoom();
    const { minY, maxY } = useGraph()

    const [ways, setWays] = useState<WaysConditions>()
    const [options, setOptions] = useState<HotlineOptions>({});

    useEffect( () => {
        setOptions( { palette, min: minY, max: maxY } )
    }, [palette, minY, maxY])

    const request = async (bounds: LatLngBounds) => {
        const z = Math.max(1, zoom - 12)
        const { data } = await getBoundedWaysConditions(toMapBounds(bounds), type, z)
        console.log(data);
        setWays( data )
        if ( onClick )
            setTimeout( onClick(data.way_ids[0], data.way_lengths[0]), 100 )
    }

    return (
        <WithBounds onChange={request} padding={0.1}>
            { ways 
                ? <DistHotline 
                    way_ids={ways.way_ids}
                    geometry={ways.geometry}
                    conditions={ways.conditions} 
                    options={options} /> 
                : null 
            }
        </WithBounds>
    )
}

export default BoundedWays;