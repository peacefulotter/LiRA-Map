import L, { Map } from 'leaflet';
import { DotHover } from '../../../models/graph';

import { HotlineCanvas } from '../canvas/HotlineCanvas';
import Hotline from '../renderers/Hotline';

import Util from "./util";


export class HotPolyline<CoordT extends L.LatLngExpression, DataT> extends L.Polyline 
{
    coords: CoordT[] | CoordT[][]
    projectLatLngs: (_map: Map, latlngs: CoordT[], result: any, projectedBounds: any) => void
    _renderer: HotlineCanvas<DataT>

    constructor(
        hotline: Hotline<DataT>,
        projectLatLngs: (_map: any, latlngs: any, result: any, projectedBounds: any) => void, 
        coords: CoordT[] | CoordT[][], 
    ) {
        const renderer = new HotlineCanvas<DataT>(hotline)
        super( coords, { renderer } )

        this.coords = coords;
        this.projectLatLngs = projectLatLngs;
        this._renderer = renderer;
    }

    setHover(dotHover: DotHover | undefined) 
    {
        if ( this._renderer._hotline === undefined ) return;
        this._renderer._hotline.setHover(dotHover)
        this._renderer._update()
        this.redraw()
    }

    /**
     * Just like the Leaflet version, but with support for a z coordinate.
     */
    _projectLatlngs(latlngs: CoordT[] | CoordT[][], result: any, projectedBounds: any) 
    {
        if (Array.isArray(this.coords[0]) ) 
        {
            this.coords.forEach( coords => this.projectLatLngs(this._map, coords as CoordT[], result, projectedBounds) )
        }
        else
        {
            this.projectLatLngs(this._map, this.coords as CoordT[], result, projectedBounds)
        }
        
        if ( this._renderer._hotline === undefined ) return;
        this._renderer._hotline.projectedData = [...result];
    }

    /**
     * Just like the Leaflet version, but uses `Util.clipSegment()`.
     */
    _clipPoints () 
    {
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