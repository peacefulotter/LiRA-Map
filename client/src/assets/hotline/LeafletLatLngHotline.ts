
import L from 'leaflet'
import { HotlineOptions } from '../../models/path';
import LatLngHotline, { LatLngData, LatLngInput } from './core/LatLngHotline';
import { HotPolyline } from './hotline';


const projectLatLngs = (_map: any, latlngs: any, result: any, projectedBounds: any) => {
    const len = latlngs.length;
    const ring = [];
    for (let i = 0; i < len; i++) 
    {
        ring[i] = _map.latLngToLayerPoint(latlngs[i]);
        ring[i].z = latlngs[i].alt;
        ring[i].i = i
        projectedBounds.extend(ring[i]);
    }
    result.push(ring);
}

const LeafletLatLngHotline = (coords: LatLngInput, options: HotlineOptions) => {
    if ( !L.Browser.canvas ) 
        throw new Error('no Browser canvas')

    const getHotline = (canvas: HTMLElement) => new LatLngHotline(canvas);

    const hotline = new HotPolyline<LatLngData>(getHotline, projectLatLngs, coords, options) 

    return hotline
};


export default LeafletLatLngHotline;