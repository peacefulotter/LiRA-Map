
import L from 'leaflet'

import DistHotline, { DistData, DistInput } from './core/DistHotline';

import getLeafletHotline from './hotline';
import getHotlineRenderer from './renderer';

import { Geometry, HotlineOptions, RoadConditions } from '../../models/path';

const projectLatLngs = (_map: any, latlngs: any, result: any, projectedBounds: any) => {
    const len = latlngs.length;
    const ring = [];
    for (let i = 0; i < len; i++) 
    {
        ring[i] = _map.latLngToLayerPoint(latlngs[i]);
        ring[i].z = null
        ring[i].i = i
        projectedBounds.extend(ring[i]);
    }
    console.log(ring);
    
    result.push(ring);
}

const LeafletDistHotline = (geom: Geometry, conditions: RoadConditions, options: HotlineOptions, dotHoverIndex: number | undefined) => {
    if ( !L.Browser.canvas ) 
        throw new Error('no Browser canvas')

    const getHotline = (canvas: HTMLElement) => new DistHotline(canvas, dotHoverIndex, conditions);
    
    const HotlineRenderer = getHotlineRenderer(getHotline)

    const Hotline = getLeafletHotline<Geometry, DistData>( HotlineRenderer, projectLatLngs )

    const hotline = new Hotline(geom, options) as DistHotline

    return hotline as any;
};


export default LeafletDistHotline;