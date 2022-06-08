

import { HotlineOptions, HotlinePalette } from "../../../models/path";
import RGB from "../utils/RGB";



export type HotlineClass<DataT> = new (options?: HotlineOptions) => Hotline<DataT>; 

const defaultPalette = {
    0.0: 'green',
    0.5: 'yellow',
    1.0: 'red'
}; 

/**
	 * Core renderer.
	 * @constructor
	 * @param {HTMLElement | string} canvas - &lt;canvas> element or its id
	 * to initialize the instance on.
	 */
abstract class Hotline<DataT> extends L.Renderer {

    _canvas: HTMLCanvasElement | undefined;
    _ctx: CanvasRenderingContext2D | undefined;
    _width: number | undefined;
    _height: number | undefined;

    _weight: number;
    _weightFunc: ((a: number, b: number) => number) | undefined;
    _outlineWidth: number | undefined;
    _outlineColor: string;
    _min: number;
    _max: number;
    _data: DataT[];
    _palette: Uint8ClampedArray;

    _lastCode: any;
    projectedData: DataT[]
    isHover: number | undefined;

    constructor(options?: HotlineOptions)
    {
        super()
        this._weight = options?.weight || 5;
        this._outlineWidth = options?.outlineWidth;
        this._outlineColor = 'black';
    
        this._min = options?.min || 0;
        this._max = options?.max || 1;

        this._data = [];
        this.projectedData = []
        this.isHover = undefined;
    
        this._palette = new Uint8ClampedArray()
        this.palette(options?.palette || defaultPalette);
    }

    setCanvas(canvas: HTMLCanvasElement)
    {
        this._canvas = typeof canvas === 'string'
            ? document.getElementById(canvas) as any
            : canvas;
    
        this._ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        this._width = canvas.width;
        this._height = canvas.height;
    }

    setHover(isHover: number | undefined)
    {
        this.isHover = isHover;
        this.draw()
    }

    /**
     * Sets the width of the canvas. Used when clearing the canvas.
     * @param {number} width - Width of the canvas.
     */
    width(width: number) {
        this._width = width;
        return this;
    }

    /**
     * Sets the height of the canvas. Used when clearing the canvas.
     * @param {number} height - Height of the canvas.
     */
    height(height: number) {
        this._height = height;
        return this;
    }

    // /**
    //  * Sets the weight of the path.
    //  * @param {number} weight - Weight of the path in px.
    //  */
    // weight(weight: number) {
    //     this._weight = weight;
    //     return this;
    // }


    // /**
    //  * Sets the weight function for the path.
    //  * @param {(a: number, b: number) => number} weightFunc - Weight Function for the path in px.
    //  */
    //  weightFunc(weightFunc: (a: number, b: number) => number) {
    //     this._weightFunc = weightFunc;
    //     return this;
    // }

    // /**
    //  * Sets the width of the outline around the path.
    //  * @param {number} outlineWidth - Width of the outline in px.
    //  */
    // outlineWidth(outlineWidth: number) {
    //     this._outlineWidth = outlineWidth;
    //     return this;
    // }

    // /**
    //  * Sets the color of the outline around the path.
    //  * @param {string} outlineColor - A CSS color value.
    //  */
    // outlineColor(outlineColor: string) {
    //     this._outlineColor = outlineColor;
    //     return this;
    // }

    /**
     * Sets the palette gradient.
     * @param {Object.<number, string>} palette  - Gradient definition.
     * e.g. { 0.0: 'white', 1.0: 'black' }
     */
    palette(palette: HotlinePalette) {
        const canvas = document.createElement('canvas'),
                 ctx = canvas.getContext('2d') as CanvasRenderingContext2D,
            gradient = ctx.createLinearGradient(0, 0, 0, 256);

        canvas.width = 1;
        canvas.height = 256;

        Object.keys(palette).forEach( (offset: string) => {
            const i = parseFloat(offset)
            gradient.addColorStop(i, palette[i]);
        })

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1, 256);

        this._palette = ctx.getImageData(0, 0, 1, 256).data;

        return this;
    }

    // /**
    //  * Sets the value used at the start of the palette gradient.
    //  * @param {number} min
    //  */
    // min(min: number) {
    //     this._min = min;
    //     return this;
    // }

    // /**
    //  * Sets the value used at the end of the palette gradient.
    //  * @param {number} max
    //  */
    // max(max: number) {
    //     this._max = max;
    //     return this;
    // }

    /**
     * A path to rander as a hotline.
     * @typedef Array.<{x:number, y:number, z:number}> Path - Array of x, y and z coordinates.
     */

    /**
     * Sets the data that gets drawn on the canvas.
     * @param {(Path|Path[])} data - A single path or an array of paths.
     */
    data(data: DataT[]) {
        this._data = data;
        return this;
    }

    /**
     * Adds a path to the list of paths.
     * @param {Path} path
     */
    add(path: DataT) {
        this._data.push(path);
        return this;
    }

    /**
     * Draws the currently set paths.
     */
    draw() {
        const ctx = this._ctx;

        if ( ctx === undefined ) return;

        ctx.globalCompositeOperation = 'source-over';
        ctx.lineCap = 'round';

        this._drawOutline();
        this._drawHotline();

        return this;
    }

    /**
     * Gets the RGB values of a given z value of the current palette.
     * @param {number} value - Value to get the color for, should be between min and max.
     * @returns {RGB} The RGB values as an array [r, g, b]
     */
    getRGBForValue(value: number): RGB {
        var valueRelative = Math.min(Math.max((value - this._min) / (this._max - this._min), 0), 0.999);
        var paletteIndex = Math.floor(valueRelative * 256) * 4;

        return new RGB(
            this._palette[paletteIndex],
            this._palette[paletteIndex + 1],
            this._palette[paletteIndex + 2]
        );
    }

    /**
     * Draws the outline of the graphs.
     * @private
     */
    _drawOutline() {

        if ( this._ctx === undefined || !this._outlineWidth ) return;

        for (let i = 0, dataLength = this._data.length; i < dataLength; i++) 
        {
            let path = this._data[i] as any; // ==== fixme

            for (let j = 1, pathLength = path.length; j < pathLength; j++) 
            {
                let pointStart = path[j - 1] as any;
                let pointEnd = path[j] as any;
                
                const ctx = this._ctx;
                ctx.lineWidth = this._outlineWidth;
                ctx.strokeStyle = this._outlineColor;
                ctx.beginPath();
                ctx.moveTo(pointStart.x, pointStart.y);
                ctx.lineTo(pointEnd.x, pointEnd.y);
                ctx.stroke();
            }
        }
    }

    _addColorGradient(gradient: any, rgb: RGB, dist: number) {
        gradient.addColorStop(dist, 'rgb(' + rgb.get().join(',') + ')');
    }


    /**
     * Draws the color encoded hotline of the graphs.
     * @private
     */
    abstract _drawHotline(): void;
}

export default Hotline;