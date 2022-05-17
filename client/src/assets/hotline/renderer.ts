
import { Canvas } from 'leaflet'
import LatLngHotline from './LatLngHotline';


export type Renderer = (new (...args: any[]) => any) & typeof Canvas

const hotlineRenderer = (dotHoverIndex: number | undefined) => L.Canvas.extend( { 
    
    _initContainer: function () {
        (L.Canvas.prototype as any)._initContainer.call(this);
        this._hotline = new LatLngHotline(this._container, dotHoverIndex);
    },

    _update: function () {
        (L.Canvas.prototype as any)._update.call(this);
        this._hotline.width(this._container.width);
        this._hotline.height(this._container.height);
    },

    _updatePoly: function (layer: any) {

        const parts = layer._parts;

        if ( !this._drawing || !parts.length ) { return; }

        this._updateOptions(layer);

        this._hotline
            .data(parts)
            .draw();
    },

    _updateOptions: function (layer: any) {

        const { options } = layer;

        if (options.min != null) {
            this._hotline.min(options.min);
        }
        if (layer.options.max != null) {
            this._hotline.max(options.max);
        }
        if (layer.options.weight != null) {
            this._hotline.weight(options.weight);
        }
        if (layer.options.weightFunc != null) {
            this._hotline.weightFunc(options.weightFunc);
        }
        if (layer.options.outlineWidth != null) {
            this._hotline.outlineWidth(options.outlineWidth);
        }
        if (layer.options.outlineColor != null) {
            this._hotline.outlineColor(options.outlineColor);
        }
        if (layer.options.palette) {
            this._hotline.palette(options.palette);
        }
    }
} ) as Renderer;

export default hotlineRenderer;