
import { FC, useEffect, useMemo, useState } from 'react';
import { LeafletEvent, LeafletMouseEvent } from 'leaflet'
import { Polyline } from 'react-leaflet';
import { HotlineOptions, useCustomHotline } from 'react-leaflet-hotline';

import { useGraph } from '../../../context/GraphContext';
import { useZoom } from '../../../context/ZoomContext';

import { Condition, Node, WayId } from '../../../models/path';

import DistRenderer from '../../../assets/hotline/DistRenderer';
import { DistData } from '../../../assets/hotline/hotline';
import HoverHotPolyline from '../../../assets/hotline/HoverHotPolyline';
import { HotlineEventHandlers } from 'react-leaflet-hotline/lib/types';


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

    const opts = useMemo( () => ({ 
        ...options, weight: getWeight(zoom)
    }), [options, zoom] )

    const eventHandlers: HotlineEventHandlers = {
        click: (e: LeafletEvent, i: number) => {
            console.log('here', i, e);
        },
        mouseover: (e: LeafletEvent, i: number) => console.log(e, i)
    }

    const { hotline } = useCustomHotline<Node, DistData>( 
        DistRenderer, HoverHotPolyline, 
        { data: geometry, getLat, getLng, getVal, options: opts, eventHandlers }, 
        way_ids, conditions 
    );
    
    useEffect( () => {
        if ( hotline === undefined ) return;
        (hotline as HoverHotPolyline<Node, DistData>).setHover(dotHover)
    }, [dotHover])

    return null;
}


export default DistHotline;