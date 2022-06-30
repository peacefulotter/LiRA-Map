
import { FC, useEffect, useMemo } from 'react';
import { HotlineOptions, useCustomHotline } from 'react-leaflet-hotline';

import { useGraph } from '../../../context/GraphContext';
import { useZoom } from '../../../context/ZoomContext';

import { Condition, Node, WayId } from '../../../models/path';

import DistRenderer from '../../../assets/hotline/DistRenderer';
import { DistData } from '../../../assets/hotline/hotline';
import HoverHotPolyline from '../../../assets/hotline/HoverHotPolyline';
import { useMapEvents } from 'react-leaflet';


const getLat = (n: Node) => n.lat;
const getLng = (n: Node) => n.lng;
const getVal = (n: Node) => n.way_dist;
const getWeight = (zoom: number) => Math.max(zoom > 8 ? zoom - 6 : zoom - 5, 2)

interface IDistHotline {
    way_ids: WayId[];
    geometry: Node[][];
    conditions: Condition[][];
    options?: HotlineOptions
}

const DistHotline: FC<IDistHotline> = ( { way_ids, geometry, conditions, options } ) => {

    const { dotHover } = useGraph()
    const { zoom } = useZoom()

    const map = useMapEvents({
        click: (e) => console.log((e.originalEvent.target as any)._leaflet_id, (renderer as any)._leaflet_id, (polyline as any)._leaflet_id)
    })

    const opts = useMemo( () => ({ 
        ...options, weight: getWeight(zoom)
    }), [options, zoom] )

    const createHotline = useCustomHotline<Node, DistData>( DistRenderer, HoverHotPolyline )
    const [renderer, polyline] = createHotline( geometry, getLat, getLng, getVal, opts, way_ids, conditions ) as [DistRenderer, HoverHotPolyline<Node, DistData>]
    
    useEffect( () => {
        if ( polyline === undefined ) return;
        polyline.setHover(dotHover)
    }, [dotHover])

    return null;
}


export default DistHotline;