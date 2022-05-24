
import L from 'leaflet'
import { HotlineOptions } from '../../models/path';
import { InputHotlineData } from './core/Hotline';
import LatLngHotline from './core/LatLngHotline';
import getLeafletHotline, { HotlineType } from './hotline';
import getHotlineRenderer from './renderer';

const LeafletLatLngHotline = (data: InputHotlineData, options: HotlineOptions, dotHoverIndex: number | undefined) => {
    if ( !L.Browser.canvas ) 
        throw new Error('no Browser canvas')

    const getHotline = (canvas: HTMLElement) => new LatLngHotline(canvas, dotHoverIndex);
    
    const HotlineRenderer = getHotlineRenderer(getHotline)

    const Hotline: HotlineType = getLeafletHotline( HotlineRenderer )

    return new Hotline(data, options)
};


export default LeafletLatLngHotline;