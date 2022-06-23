
import L, { Map, LatLngExpression } from 'leaflet'
import { HotPolyline } from './core/HotPolyline';
import { HotlineOptions, LatLngData, LatLngInput, ReactHotline } from './hotline';
import LatLngHotline from './renderers/LatLngHotline';


const projectLatLngs = (_map: Map, latlngs: any[], result: any, projectedBounds: any) => {
    const len = latlngs.length;
    const ring: any[] = [];
    for (let i = 0; i < len; i++) 
    {
        ring[i] = _map.latLngToLayerPoint(latlngs[i]);
        ring[i].z = latlngs[i].value;
        ring[i].i = i
        projectedBounds.extend(ring[i]);
    }
    result.push(ring);
}

const LeafletLatLngHotline: ReactHotline<LatLngInput, LatLngData, LatLngExpression, LatLngHotline> = (
    coords: LatLngInput, options: HotlineOptions
) => 
{
    if ( !L.Browser.canvas ) 
        throw new Error('no Browser canvas')

    const hotline = new LatLngHotline(options)

    const polyline = new HotPolyline<LatLngExpression, LatLngData>(hotline, projectLatLngs, coords) 

    return [polyline, hotline]
};


export default LeafletLatLngHotline;