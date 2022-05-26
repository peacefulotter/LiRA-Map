import L from 'leaflet';
import { HotlineOptions } from '../../models/path';
import Hotline from './core/Hotline';
import { Renderer } from './renderer';
import Util from "./util";


export type HotlineClass<InputT, DataT> = new (data: InputT, options?: HotlineOptions) => Hotline<DataT>


const getRenderer = (RendererClass: Renderer) => (opts?: any) => 
    L.Browser.canvas ? new RendererClass(opts) : null


const getLeafletHotline = <InputT, DataT>( 

    RendererClass: Renderer, 
    projectLatLngs: (_map: any, latlngs: any, result: any, projectedBounds: any) => void 

) => L.Polyline.extend( {

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
    _projectLatlngs: function(latlngs: any, result: any, projectedBounds: any) 
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
            projectLatLngs(this._map, latlngs, result, projectedBounds)
        }
        
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

        this._parts = [];

        const parts = this._parts;
        const bounds = this._pxBounds;

        for (let i = 0, k = 0, len = this._rings.length; i < len; i++) 
        {
            const points = this._rings[i];

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
    },

    _clickTolerance: function () {
        return this.options.weight / 2 + this.options.outlineWidth + (L.Browser.touch ? 10 : 0);
    }
} ) as HotlineClass<InputT, DataT>


export default getLeafletHotline