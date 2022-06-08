
import { RendererOptions } from 'leaflet'
import Hotline from '../renderers/Hotline';


export class HotlineCanvas<DataT> extends L.Canvas 
{
    _hotline: Hotline<DataT>;

    constructor(hotline: Hotline<DataT>, options?: RendererOptions | undefined)
    {
        super(options);
        this._hotline = hotline;
    }

    _initContainer() 
    {
        (L.Canvas.prototype as any)._initContainer.call(this);
        this._hotline.setCanvas((this as any)._container)
    }

    _destroyContainer() 
    {
        (L.Canvas.prototype as any)._destroyContainer.call(this)
    }

    _update() 
    {
        (L.Canvas.prototype as any)._update.call(this);
        this._hotline.width((this as any)._container.width);
        this._hotline.height((this as any)._container.height);
    }

    _updatePoly(layer: any) 
    {
        const parts = layer._parts;

        if ( !(this as any)._drawing || !parts.length ) { return; }

        this._updateOptions(layer);

        this._hotline
            .data(parts)
            .draw();
    }

    _updateOptions(layer: any) {}
}