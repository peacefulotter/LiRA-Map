
import L, { Map, LatLng } from 'leaflet'
import { HotlineOptions } from '../../models/path';
import { HotPolyline } from './core/HotPolyline';
import LatLngHotline, { LatLngData, LatLngInput } from './renderers/LatLngHotline';


const projectLatLngs = (_map: Map, latlngs: LatLng[], result: any, projectedBounds: any) => {
    const len = latlngs.length;
    const ring: any[] = [];
    for (let i = 0; i < len; i++) 
    {
        ring[i] = _map.latLngToLayerPoint(latlngs[i]);
        ring[i].z = latlngs[i].alt;
        ring[i].i = i
        projectedBounds.extend(ring[i]);
    }
    result.push(ring);
}

const LeafletLatLngHotline = (
    coords: LatLngInput, options: HotlineOptions
)
: [HotPolyline<LatLngData>, LatLngHotline] => 
{
    if ( !L.Browser.canvas ) 
        throw new Error('no Browser canvas')

    const hotline = new LatLngHotline(options)

    const polyline = new HotPolyline<LatLngData>(hotline, projectLatLngs, coords) 

    return [polyline, hotline]
};


export default LeafletLatLngHotline;