
import { useEffect, useMemo, useState } from 'react';
import { useMapEvents } from 'react-leaflet';
import L from 'leaflet'

import ArrowHead from './ArrowHead';

import { useGraph } from '../../../context/GraphContext';

import { HotlineOptions, HotlinePalette, PointData } from '../../../models/path';
import { Renderer } from '../../../models/renderers';
import { Palette } from '../../../models/graph';

import { palette, width } from '../../../assets/properties';

import LeafletLatLngHotline from '../../../assets/hotline/LeafletLatLngHotline';
import { LatLngInput } from '../../../assets/hotline/renderers/LatLngHotline';


// const _weightFunc = useCallback( (a: number, b: number) => {
    //     const c = dotHoverIndex ? dotHoverIndex >= a && dotHoverIndex < b : false
    //     // console.log(dotHoverIndex, a, b, c);
    //     return c ? 10 : 4
    //     // TODO path[a:b].properties (average?)
    //     // return dotHoverIndex 
    //     //     ?  dotHoverIndex >= a && dotHoverIndex < b
    //     //         ? 10
    //     //         : 0
    //     //     :  width(path[a].properties, properties)
    //     // console.log(zoom);
    //     // const formula = ((i * 10) / coords.length) + 4
    //     // const dilatation = (i: number) => Math.pow((i + length) / length, dilatationFactor)
    //     // + Math.max(zoom / 5, 2)
    // }, [dotHoverIndex])


const toHotlinePalette = (pal: Palette, maxY: number): HotlinePalette => {
    return pal.reduce( (obj, cur) => {
        const { offset, color, stopValue } = cur
        const key: number = stopValue ? Math.max(0, Math.min(1, stopValue / maxY)) : offset
        return {...obj, [key]: color}
      }, {} as HotlinePalette )
}

const Hotline: Renderer = ( { path, properties, onClick  } ) => {

    const map = useMapEvents({})

    const { dotHover, minY, maxY } = useGraph()

    const [coords, setCoords] = useState<LatLngInput>([])

    const options: HotlineOptions = useMemo( () => { 
        const p = palette(properties)
        const min = p[0].stopValue            || minY || 0
        const max = p[p.length - 1].stopValue || maxY || 1

        const hotlinePal = toHotlinePalette(p, max)
        
        return {
            weight: width(undefined, properties),
            outlineWidth: 0,
            palette: hotlinePal,
            min: min,
            max: max,
            onclick: onClick ? onClick(0) : undefined
        } 
    }, [properties, minY, maxY, onClick] )

    useEffect( () => {
        if ( path === undefined || path.length === 0 ) return;
        setCoords( path.map( ({lat, lng, value}) => ({lat, lng, alt: value})) )
    }, [path])

    useEffect( () => {
        if ( coords.length === 0 ) return;

        const [polyline, _] = LeafletLatLngHotline( coords, options )

        polyline.addTo(map)

        return () => { 
            polyline.remove()
            map.removeLayer(polyline);
        }

    }, [map, options, coords, dotHover])


    const origin = path[path.length - 2]
    const end = path[path.length - 1]
    return <ArrowHead key={Math.random()} origin={origin} end={end} />;
}

export default Hotline;