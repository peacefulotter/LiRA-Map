
import { FC, useEffect, useMemo, useState } from 'react';
import { useMapEvents } from 'react-leaflet';

import { MapConditions, Node } from '../../models/path';

import { useGraph } from '../../context/GraphContext';
import { useZoom } from '../../context/ZoomContext';

import DistHotline, { DistData } from '../../assets/hotline/renderers/DistHotline';
import LeafletDistHotline from '../../assets/hotline/LeafletDistHotline';
import { HotPolyline } from '../../assets/hotline/core/HotPolyline';
import { DEFAULT_PALETTE } from '../../assets/properties';
import { Palette } from '../../models/graph';

interface RCRendererProps {
    mcs: MapConditions;
    palette?: Palette;
}


const RCHotline: FC<RCRendererProps> = ( { mcs, palette  } ) => {

    const { dotHover, minY, maxY } = useGraph()

    const map = useMapEvents({})
    const { zoom } = useZoom()

    const [hotline, setHotline] = useState<DistHotline>()
    const [hotPolyline, setHotPolyline] = useState<HotPolyline<Node, DistData>>()

    const getOptions = () => {
        const p = palette || DEFAULT_PALETTE;
        const min = minY || 0
        const max = maxY || 1

        return {
            weight: Math.max(zoom > 8 ? zoom - 6 : zoom - 5, 2),
            outlineWidth: 0,
            palette: p,
            min: min,
            max: max,
        }
    }
    
    useEffect( () => {
        if ( hotline === undefined ) return;
        hotline.setOptions(getOptions())
    }, [palette, minY, maxY, zoom] )


    useEffect( () => {
        if ( hotPolyline === undefined ) return;
        hotPolyline.setHover(dotHover)
    }, [dotHover])

    useEffect( () => {
        if ( hotline === undefined ) return;
        hotline.setConditions(mcs)
    }, [mcs])

    useEffect( () => {

        const [_hotPolyline, _hotline] = LeafletDistHotline( mcs, getOptions() )
        
        _hotPolyline.addTo(map)

        setHotline(_hotline)
        setHotPolyline(_hotPolyline)

        return () => { 
            _hotPolyline.remove()
            map.removeLayer(_hotPolyline);
        }

    }, [map])


    // const origin = path[path.length - 2]
    // const end = path[path.length - 1]
    return null // <ArrowHead key={Math.random()} origin={origin} end={end} />;
}

export default RCHotline;