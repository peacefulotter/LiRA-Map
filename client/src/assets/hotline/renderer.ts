
import { Canvas, RendererOptions } from 'leaflet'
import Hotline from './core/Hotline';


export type Renderer = (new (...args: any[]) => any) & typeof Canvas

export class HotlineRenderer<DataT> extends L.Canvas 
{
    _hotline: Hotline<DataT> | undefined
    getHotline: (container: HTMLElement) => Hotline<DataT>;

    constructor(getHotline: (container: HTMLElement) => Hotline<DataT>, options?: RendererOptions | undefined)
    {
        super(options)
        this.getHotline = getHotline;
    }

    _initContainer() {
        (L.Canvas.prototype as any)._initContainer.call(this);
        this._hotline = this.getHotline((this as any)._container)
    }

    _destroyContainer() {
        (L.Canvas.prototype as any)._destroyContainer.call(this)
    }

    _update() {
        (L.Canvas.prototype as any)._update.call(this);
        if (this._hotline === undefined) return;
        this._hotline.width((this as any)._container.width);
        this._hotline.height((this as any)._container.height);
    }

    _updatePoly(layer: any) {

        const parts = layer._parts;

        if ( !(this as any)._drawing || !parts.length ) { return; }

        this._updateOptions(layer);

        (this as any)._hotline
            .data(parts)
            .draw();
    }

    _updateOptions(layer: any) {

        if ( this._hotline === undefined ) return;

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
}