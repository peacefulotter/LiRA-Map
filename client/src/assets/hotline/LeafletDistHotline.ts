
import L from 'leaflet'

import { InputHotlineData } from './core/Hotline';
import DistHotline from './core/DistHotline';

import getLeafletHotline, { HotlineType } from './hotline';
import getHotlineRenderer from './renderer';

import { HotlineOptions } from '../../models/path';

const LeafletDistHotline = (data: InputHotlineData, options: HotlineOptions, dotHoverIndex: number | undefined, dists: any) => {
    if ( !L.Browser.canvas ) 
        throw new Error('no Browser canvas')

    const getHotline = (canvas: HTMLElement) => new DistHotline(canvas, dotHoverIndex, dists);
    
    const HotlineRenderer = getHotlineRenderer(getHotline)

    const Hotline: HotlineType = getLeafletHotline( HotlineRenderer )

    return new Hotline(data, options)
};


export default LeafletDistHotline;