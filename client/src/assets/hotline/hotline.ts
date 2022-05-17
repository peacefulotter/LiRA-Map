import L from 'leaflet';
import { HotlineOptions } from '../../models/path';
import { InputHotlineData } from './core';
import hotlineRenderer, { Renderer } from './renderer';
import Util from "./util";

type HotlineType =  (new (...args: any[]) => any) & any



const getRenderer = (RendererClass: Renderer) => (opts?: any) => 
    L.Browser.canvas ? new RendererClass(opts) : null


const _hotline = ( RendererClass: Renderer ) => L.Polyline.extend( {
    statics: {
        Renderer: RendererClass,
        renderer: getRenderer(RendererClass)
    },

    options: {
        renderer: getRenderer(RendererClass)(),
        min: 0,
        max: 1,
        palette: {
            0.0: 'green',
            0.5: 'yellow',
            1.0: 'red'
        },
        weight: 5,
        outlineColor: 'black',
        outlineWidth: 1
    },

    getRGBForValue: function (value: number) {
        return this._renderer._hotline.getRGBForValue(value);
    },

    /**
     * Just like the Leaflet version, but with support for a z coordinate.
     */
    _projectLatlngs: function (latlngs: any, result: any, projectedBounds: any) {
        const len = latlngs.length;
        var i, ring;

        if (latlngs[0] instanceof L.LatLng) {
            ring = [];
            for (i = 0; i < len; i++) {
                ring[i] = this._map.latLngToLayerPoint(latlngs[i]);
                // Add the altitude of the latLng as the z coordinate to the point
                ring[i].z = latlngs[i].alt;
                ring[i].i = i
                // ring[i].d = distances[i];
                projectedBounds.extend(ring[i]);
            }
            result.push(ring);
        } else if (Array.isArray(latlngs[0]) ) {
            for (i = 0; i < len; i++) {
                this._projectLatlngs(latlngs[i], result, projectedBounds);
            }
        }
        
        console.log(result);
        this._renderer._hotline.projectedData = [...result];
    },

    /**
     * Just like the Leaflet version, but uses `Util.clipSegment()`.
     */
    _clipPoints: function () {
        if (this.options.noClip) {
            this._parts = this._rings;
            return;
        }


        console.log(this);
        console.log(this._bounds);
        console.log(this._pxBounds);

        this._parts = [];

        const parts = this._parts;
        const bounds = this._pxBounds;
        let i, j, k, len, len2, segment, points;

        for (i = 0, k = 0, len = this._rings.length; i < len; i++) {
            points = this._rings[i];

            for (j = 0, len2 = points.length; j < len2 - 1; j++) {
                segment = Util.clipSegment(this._renderer._hotline, points[j], points[j + 1], bounds, j, true);

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
    },

    _clickTolerance: function () {
        return this.options.weight / 2 + this.options.outlineWidth + (L.Browser.touch ? 10 : 0);
    }
} ) as HotlineType


const HotlineComponent = (data: InputHotlineData, options: HotlineOptions, dotHoverIndex: number | undefined) => {
    if ( !L.Browser.canvas ) 
        throw new Error('no Browser canvas')

    const HotlineRenderer = hotlineRenderer(dotHoverIndex)
    console.log(HotlineRenderer);
    console.log(new HotlineRenderer());
    
    const Hotline = _hotline( HotlineRenderer )

	return new Hotline(data, options)
};


export default HotlineComponent;