
import { FC, useEffect, useMemo, useState } from 'react';
import { useMapEvents } from 'react-leaflet';
import L from 'leaflet'
import { Palette } from '../../models/graph';
import { Geometry, HotlineOptions, HotlinePalette, PointData, RoadConditions } from '../../models/path';
import { RendererProps } from '../../models/renderers';
import { useGraph } from '../../context/GraphContext';
import { palette, width } from '../../assets/properties';
import LeafletDistHotline from '../../assets/hotline/LeafletDistHotline';
import ArrowHead from '../Map/Renderers/ArrowHead';
import DistHotline, { DistInput } from '../../assets/hotline/core/DistHotline';
import { Measurement } from '../../models/properties';
import Hotline from '../../assets/hotline/core/Hotline';

interface RCRendererProps {
    geometry: Geometry
    conditions: RoadConditions
    properties: Measurement;
}

const toHotlinePalette = (pal: Palette, maxY: number): HotlinePalette => {
    return pal.reduce( (obj, cur) => {
        const { offset, color, stopValue } = cur
        const key: number = stopValue ? Math.max(0, Math.min(1, stopValue / maxY)) : offset
        return {...obj, [key]: color}
      }, {} as HotlinePalette )
}

const RCHotline: FC<RCRendererProps> = ( { geometry, conditions, properties  } ) => {

    const { dotHoverIndex, minY, maxY } = useGraph()

    const map = useMapEvents({})

    const [hotline, setHotline] = useState<DistHotline>()
    
    const options: HotlineOptions = useMemo( () => { 
        const p = palette(properties)
        const min = p[0].stopValue            || minY || 0
        const max = p[p.length - 1].stopValue || maxY || 1

        const hotlinePal = toHotlinePalette(p, max)
        
        return {
            weight: width(undefined, properties),
            weightFunc: (a: number, b: number) => 10,
            outlineWidth: 0,
            palette: hotlinePal,
            min: min,
            max: max,
        } 
    }, [properties, minY, maxY] )


    useEffect( () => {
        if ( hotline === undefined ) return;
        console.log(dotHoverIndex);
        console.log(hotline);
        
        hotline.setHover(dotHoverIndex)
    }, [dotHoverIndex])

    useEffect( () => {
        if ( geometry.length === 0 ) return;

        const _hotline = LeafletDistHotline( geometry, conditions, options )

        _hotline.addTo(map)

        setHotline(_hotline)

        return () => { 
            _hotline.remove()
            map.removeLayer(_hotline);
        }
    }, [map])


    // const origin = path[path.length - 2]
    // const end = path[path.length - 1]
    return null // <ArrowHead key={Math.random()} origin={origin} end={end} />;
}

export default RCHotline;