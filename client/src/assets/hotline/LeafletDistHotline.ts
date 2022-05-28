
import L from 'leaflet'

import DistHotline, { DistData } from './core/DistHotline';

import { HotPolyline } from './hotline';

import { Geometry, HotlineOptions, RoadConditions } from '../../models/path';

const projectLatLngs = (_map: any, latlngs: any, result: any, projectedBounds: any) => {
    const len = latlngs.length;
    const ring = [];
    for (let i = 0; i < len; i++) 
    {
        ring[i] = _map.latLngToLayerPoint(latlngs[i]);
        ring[i].i = i
        projectedBounds.extend(ring[i]);
    }
    result.push(ring);
}

const LeafletDistHotline = (geom: Geometry, conditions: RoadConditions, options: HotlineOptions) => {
    if ( !L.Browser.canvas ) 
        throw new Error('no Browser canvas')

    const coords = geom.map(g => ({lat: g.lat, lng: g.lon}))

    const getHotline = (canvas: HTMLElement) => new DistHotline(canvas, conditions);
    
    const hotline = new HotPolyline<DistData>(getHotline, projectLatLngs, coords, options) // getLeafletHotline<Geometry, DistData>( getHotline, projectLatLngs )

    // const hotline = new Hotline(geom, options) as DistHotline

    return hotline as any;
};


export default LeafletDistHotline;