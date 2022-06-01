
import L, { LatLng, Map } from 'leaflet'

import DistHotline, { DistData } from './renderers/DistHotline';

import { HotPolyline } from './core/HotPolyline';

import { Geometry, HotlineOptions, WayConditions } from '../../models/path';

const projectLatLngs = (_map: Map, latlngs: LatLng[], result: any, projectedBounds: any) => {
    const len = latlngs.length;
    const ring: any[] = [];
    for (let i = 0; i < len; i++) 
    {
        ring[i] = _map.latLngToLayerPoint(latlngs[i]);
        ring[i].i = i
        projectedBounds.extend(ring[i]);
    }
    result.push(ring);
}

const LeafletDistHotline = (
    geom: Geometry, conditions: WayConditions, options: HotlineOptions
)
: [HotPolyline<DistData>, DistHotline] => 
{
    if ( !L.Browser.canvas ) 
        throw new Error('no Browser canvas')

    const coords = geom.map(g => ({lat: g.lat, lng: g.lon}))

    const hotline = new DistHotline(conditions, options)

    const polyline = new HotPolyline<DistData>(hotline, projectLatLngs, coords) 

    return [polyline, hotline];
};


export default LeafletDistHotline;