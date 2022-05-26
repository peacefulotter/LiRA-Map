
import L from 'leaflet'
import { HotlineOptions } from '../../models/path';
import LatLngHotline, { LatLngData, LatLngInput } from './core/LatLngHotline';
import getLeafletHotline from './hotline';
import getHotlineRenderer from './renderer';


const projectLatLngs = (_map: any, latlngs: any, result: any, projectedBounds: any) => {
    const len = latlngs.length;
    const ring = [];
    for (let i = 0; i < len; i++) 
    {
        ring[i] = _map.latLngToLayerPoint(latlngs[i]);
        // Add the altitude of the latLng as the z coordinate to the point
        ring[i].z = latlngs[i].alt;
        ring[i].i = i
        // ring[i].d = distances[i];
        projectedBounds.extend(ring[i]);
    }
    result.push(ring);
}

const LeafletLatLngHotline = (data: LatLngInput, options: HotlineOptions, dotHoverIndex: number | undefined) => {
    if ( !L.Browser.canvas ) 
        throw new Error('no Browser canvas')

    const getHotline = (canvas: HTMLElement) => new LatLngHotline(canvas, dotHoverIndex);
    
    const HotlineRenderer = getHotlineRenderer(getHotline)

    const Hotline = getLeafletHotline<LatLngInput, LatLngData>( HotlineRenderer, projectLatLngs )

    return new Hotline(data, options) as any
};


export default LeafletLatLngHotline;