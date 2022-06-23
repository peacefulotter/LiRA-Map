
import { FC, useEffect } from 'react';


import DistHotline from '../../assets/hotline/renderers/DistHotline';
import LeafletDistHotline from '../../assets/hotline/LeafletDistHotline';
import { DistData } from '../../assets/hotline/hotline';

import { MapConditions, Node } from '../../models/path';
import { Palette } from '../../models/graph';

import useHotline from '../Map/Hooks/useHotline';


interface RCRendererProps {
    mcs: MapConditions;
    palette?: Palette;
}

const RCHotline: FC<RCRendererProps> = ( { mcs, palette  } ) => {

    const options = {}
    const hotline = useHotline<MapConditions, DistData, Node, DistHotline>( LeafletDistHotline, mcs, options )

    useEffect( () => {
        if ( hotline === undefined ) return;
        hotline.setConditions(mcs)
    }, [mcs])


    // const origin = path[path.length - 2]
    // const end = path[path.length - 1]
    return null // <ArrowHead key={Math.random()} origin={origin} end={end} />;
}

export default RCHotline;