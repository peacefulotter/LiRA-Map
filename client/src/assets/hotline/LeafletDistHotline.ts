
import L, { Map } from 'leaflet'

import DistHotline, { DistData } from './renderers/DistHotline';

import { HotPolyline } from './core/HotPolyline';

import { HotlineOptions, WayConditions, Node} from '../../models/path';

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

const LeafletDistHotline = (
    nodes: Node[][], conditions: WayConditions[], options: HotlineOptions
)
: [HotPolyline<Node, DistData>, DistHotline] => 
{
    if ( !L.Browser.canvas ) 
        throw new Error('no Browser canvas')

    const hotline = new DistHotline(conditions, options)

    const polyline = new HotPolyline<Node, DistData>(hotline, projectLatLngs, nodes) 

    return [polyline, hotline];
};


export default LeafletDistHotline;