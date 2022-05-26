
import L from 'leaflet'

import DistHotline, { DistData, DistInput } from './core/DistHotline';

import getLeafletHotline from './hotline';
import getHotlineRenderer from './renderer';

import { HotlineOptions, RoadConditions } from '../../models/path';

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
    result.push(ring);
}

const LeafletDistHotline = (geom: DistInput, conditions: RoadConditions, options: HotlineOptions, dotHoverIndex: number | undefined, dists: any) => {
    if ( !L.Browser.canvas ) 
        throw new Error('no Browser canvas')

    const getHotline = (canvas: HTMLElement) => new DistHotline(canvas, dotHoverIndex, dists);
    
    const HotlineRenderer = getHotlineRenderer(getHotline)

    const Hotline = getLeafletHotline<DistInput, DistData>( HotlineRenderer, projectLatLngs )

    return new Hotline(geom, options) as any
};


export default LeafletDistHotline;