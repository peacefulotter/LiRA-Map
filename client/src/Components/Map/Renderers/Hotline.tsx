
import { FC, useEffect, useMemo, useState } from 'react';
import { useMapEvents } from 'react-leaflet';
import L from 'leaflet'
import 'Leaflet.MultiOptionsPolyline'

import ArrowHead from './ArrowHead';

import { useGraph } from '../../../context/GraphContext';

import { HotlineOptions, HotlinePalette, PointData } from '../../../models/path';
import { RendererProps } from '../../../models/renderers';
import { Palette } from '../../../models/graph';

import { palette, width } from '../../../assets/properties';

import '../../../assets/CustomHotline';


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

const Hotline: FC<RendererProps> = ( { path, properties, onClick  } ) => {

    const [coords, setCoords] = useState<[number, number, number][]>([])

    const { dotHoverIndex, minY, maxY } = useGraph()

    const map = useMapEvents({
        layeradd: (e: any) => console.log('LAYER ADD'),
        layerremove: (e: any) => console.log('LAYER REMOVE')
    })
    
    const options: HotlineOptions = useMemo( () => { 
        console.log('MEMO OPTIONS');

        const p = palette(properties)
        const min = p[0].stopValue            || minY || 0
        const max = p[p.length - 1].stopValue || maxY || 1

        const hotlinePal = toHotlinePalette(p, max)
        
        return {
            weight: width(undefined, properties),
            weightFunc: (a: number, b: number) => 4,
            outlineWidth: 0,
            palette: hotlinePal,
            min: min,
            max: max,
            onclick: onClick ? onClick(0) : undefined
        } 
    }, [properties, minY, maxY, onClick] )

    // useEffect( () => {
    //     if ( hotline === undefined) return
    //     hotline.redraw(options)
    // }, [options])

    useEffect( () => {
        if ( path === undefined || path.length === 0 ) return;
        setCoords( path.map( (p: PointData) => [p.lat, p.lng, p.value || 0]) )
    }, [path])

    useEffect( () => {
        if (coords.length === 0 || options === undefined) return;
        
        const hotline = L.Hotline( coords, options, dotHoverIndex )
        const id = L.stamp(hotline)
        console.log('new id', id);
        
        hotline.addTo(map)

        return () => { 
            console.log(map);

            // map.removeLayer(hotline);
            // hotline.removeFrom(map);

            const id = L.stamp(hotline);
            console.log('old id', id);
            
		    // console.log((map as any)._layers[id]);
            // !map._layers[id])
            
            map.removeLayer(hotline);
            // map.invalidateSize()
        }

    }, [map, options, coords, dotHoverIndex])


    const origin = path[path.length - 2]
    const end = path[path.length - 1]
    return <ArrowHead origin={origin} end={end} />;
}

export default Hotline;