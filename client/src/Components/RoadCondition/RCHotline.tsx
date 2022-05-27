
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
import { DistInput } from '../../assets/hotline/core/DistHotline';
import { Measurement } from '../../models/properties';

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

    const [coords, setCoords] = useState<DistInput>([])

    const { dotHoverIndex, minY, maxY } = useGraph()

    const map = useMapEvents({
        // layeradd: (e: any) => console.log('LAYER ADD'),
        // layerremove: (e: any) => console.log('LAYER REMOVE')
    })
    
    const options: HotlineOptions = useMemo( () => { 
        // console.log('MEMO OPTIONS');

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

    // useEffect( () => {
    //     if ( hotline === undefined) return
    //     hotline.redraw(options)
    // }, [options])

    // useEffect( () => {
    //     if ( geometry === undefined || geometry.length === 0 ) return;
    //     console.log(path, conditions);
        
    //     setCoords( path.map( (p: PointData) => [p.lat, p.lng]) )
    // }, [path])

    useEffect( () => {
        if ( geometry.length === 0 ) return;

        console.log(geometry, conditions);
        

        const hotline = LeafletDistHotline( geometry, conditions, options, dotHoverIndex )

        hotline.addTo(map)


        const id = L.stamp(hotline)

        console.log(id);
        

        return () => { 
            // console.log(hotline._renderer._container);
            hotline.remove()
            map.removeLayer(hotline);
            // hotline._renderer._destroyContainer()
            // hotline.removeFrom(map);
        }

    }, [map, options, coords, dotHoverIndex])


    // const origin = path[path.length - 2]
    // const end = path[path.length - 1]
    return null // <ArrowHead key={Math.random()} origin={origin} end={end} />;
}

export default RCHotline;