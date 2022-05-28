import L, { LatLng, Map } from 'leaflet';

import { HotlineCanvas } from '../canvas/HotlineCanvas';
import { HotlineOptions } from '../../../models/path';
import Hotline, { HotlineClass } from '../renderers/Hotline';

import Util from "./util";


export class HotPolyline<DataT> extends L.Polyline {

    projectLatLngs: (_map: Map, latlngs: LatLng[], result: any, projectedBounds: any) => void
    _renderer: HotlineCanvas<DataT>

    constructor(
        hotline: Hotline<DataT>,
        projectLatLngs: (_map: any, latlngs: any, result: any, projectedBounds: any) => void, 
        coords: L.LatLngExpression[] | L.LatLngExpression[], 
    ) {
        const renderer = new HotlineCanvas<DataT>(hotline)
        super( coords, { renderer } )

        this.projectLatLngs = projectLatLngs;
        this._renderer = renderer;
    }

    setHover(dotHover: number | undefined) {
        if ( this._renderer._hotline === undefined ) return;
        this._renderer._hotline.setHover(dotHover)
        this.redraw()
    }

    getRGBForValue(value: number) {
        if ( this._renderer._hotline === undefined ) return;
        return this._renderer._hotline.getRGBForValue(value);
    }

    /**
     * Just like the Leaflet version, but with support for a z coordinate.
     */
    _projectLatlngs(latlngs: any, result: any, projectedBounds: any) 
    {
        if (Array.isArray(latlngs[0]) ) 
        {
            const len = latlngs.length;
            for (let i = 0; i < len; i++) {
                this._projectLatlngs(latlngs[i], result, projectedBounds);
            }
        }
        else
        {
            this.projectLatLngs(this._map, latlngs, result, projectedBounds)
        }
        
        if ( this._renderer._hotline === undefined ) return;
        this._renderer._hotline.projectedData = [...result];
    }

    /**
     * Just like the Leaflet version, but uses `Util.clipSegment()`.
     */
    _clipPoints () {

        if ( this._renderer._hotline === undefined ) return;
    
        if (this.options.noClip) {
            (this as any)._parts = (this as any)._rings;
            return;
        }

        (this as any)._parts = [];

        const parts = (this as any)._parts;
        const bounds = (this as any)._pxBounds;

        for (let i = 0, k = 0, len = (this as any)._rings.length; i < len; i++) 
        {
            const points = (this as any)._rings[i];

            for (let j = 0, len2 = points.length; j < len2 - 1; j++) 
            {
                const segment = Util.clipSegment(this._renderer._hotline, points[j], points[j + 1], bounds, j, true);

                if ( segment === undefined ) { continue; }

                parts[k] = parts[k] || [];
                parts[k].push(segment[0]);

                // if segment goes out of screen, or it's the last one, it's the end of the line part
                if ((segment[1] !== points[j + 1]) || (j === len2 - 2)) {
                    parts[k].push(segment[1]);
                    k++;
                }
            }
        }
    }

    _clickTolerance() {
        return (this as any).options.weight / 2 + (this as any).options.outlineWidth + (L.Browser.touch ? 10 : 0);
    }
}