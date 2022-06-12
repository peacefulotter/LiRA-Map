
import { FC, useEffect, useMemo, useState } from 'react';
import { useMapEvents } from 'react-leaflet';
import { Palette } from '../../models/graph';
import { HotlineOptions, HotlinePalette, MapConditions, Node } from '../../models/path';
import { useGraph } from '../../context/GraphContext';
import { DEFAULT_PALETTE } from '../../assets/properties';
import LeafletDistHotline from '../../assets/hotline/LeafletDistHotline';
import DistHotline, { DistData } from '../../assets/hotline/renderers/DistHotline';
import { HotPolyline } from '../../assets/hotline/core/HotPolyline';
import { useZoom } from '../../context/ZoomContext';

interface RCRendererProps {
    mcs: MapConditions
}

const toHotlinePalette = (pal: Palette, maxY: number): HotlinePalette => {
    return pal.reduce( (obj, cur) => {
        const { offset, color, stopValue } = cur
        const key: number = stopValue ? Math.max(0, Math.min(1, stopValue / maxY)) : offset
        return {...obj, [key]: color}
      }, {} as HotlinePalette )
}

const RCHotline: FC<RCRendererProps> = ( { mcs  } ) => {

    const { dotHover, minY, maxY } = useGraph()

    const map = useMapEvents({})
    const { zoom } = useZoom()

    const [hotline, setHotline] = useState<DistHotline>()
    const [hotPolyline, setHotPolyline] = useState<HotPolyline<Node, DistData>>()

    const getOptions = () => {
        const p = DEFAULT_PALETTE
        const min = 0 // p[0].stopValue            || minY || 0
        const max = 100 // p[p.length - 1].stopValue || maxY || 1
        const hotlinePal = toHotlinePalette(p, max)

        console.log(zoom);
        
        return {
            weight: Math.max(zoom > 8 ? zoom - 6 : zoom - 5, 2),
            outlineWidth: 0,
            palette: hotlinePal,
            min: min,
            max: max,
        }
    }
    
    useEffect( () => {
        if ( hotline === undefined ) return;
        hotline.setOptions(getOptions())
    }, [minY, maxY, zoom] )


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