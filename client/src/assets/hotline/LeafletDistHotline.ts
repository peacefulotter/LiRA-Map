
import L, { Map } from 'leaflet'

import DistHotline, { DistData } from './renderers/DistHotline';

import { HotPolyline } from './core/HotPolyline';

import { HotlineOptions, Node, MapConditions} from '../../models/path';

const projectLatLngs = (_map: Map, latlngs: Node[], result: any, projectedBounds: any) => {
    const len = latlngs.length;
    const ring: DistData = [];    
    for (let i = 0; i < len; i++) 
    {
        ring[i] = _map.latLngToLayerPoint(latlngs[i]) as any;
        ring[i].i = i
        ring[i].way_dist = latlngs[i].way_dist
        projectedBounds.extend(ring[i]);
    }
    result.push(ring);
}

const LeafletDistHotline = ( mcs: MapConditions, options: HotlineOptions )
: [HotPolyline<Node, DistData>, DistHotline] => 
{
    if ( !L.Browser.canvas ) 
        throw new Error('no Browser canvas')

    console.log(mcs);
    
    const hotline = new DistHotline(mcs, options)
    
    const nodess = Object.values(mcs).map( v => v.nodes )
    const polyline = new HotPolyline<Node, DistData>(hotline, projectLatLngs, nodess) 

    return [polyline, hotline];
};


export default LeafletDistHotline;