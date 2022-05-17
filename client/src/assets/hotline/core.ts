import { HotlinePalette } from "../../models/path";

export type InputHotlinePoint = [number, number, number]
export type InputHotlineData = InputHotlinePoint[]

export interface HotlinePoint { x: number, y: number, z: number, i: number }
export type HotlineData = HotlinePoint[]

/**
	 * Core renderer.
	 * @constructor
	 * @param {HTMLElement | string} canvas - &lt;canvas> element or its id
	 * to initialize the instance on.
	 */
class Hotline {

    _canvas: HTMLCanvasElement;
    _ctx: CanvasRenderingContext2D;
    _width: number;
    _height: number;
    _weight: number;
    _weightFunc: ((a: number, b: number) => number) | undefined;
    _outlineWidth: number;
    _outlineColor: string;
    _min: number;
    _max: number;
    _data: HotlineData[];
    _palette: Uint8ClampedArray;

    _lastCode: any;
    projectedData: HotlineData[]
    dotHoverIndex: number | undefined;

    constructor(canvas: HTMLElement, dotHoverIndex: number | undefined)
    {
        const defaultPalette = {
            0.0: 'green',
            0.5: 'yellow',
            1.0: 'red'
        };        
    
        this._canvas = typeof canvas === 'string'
            ? document.getElementById(canvas) as any
            : canvas;
    
        this._ctx = this._canvas.getContext('2d') as CanvasRenderingContext2D;
        this._width = this._canvas.width;
        this._height = this._canvas.height;
    
        this._weight = 5;
        this._weightFunc = undefined
        this._outlineWidth = 1;
        this._outlineColor = 'black';
    
        this._min = 0;
        this._max = 1;
    
        this._data = [];
        this.projectedData = []
        this.dotHoverIndex = dotHoverIndex;
    
        this._palette = new Uint8ClampedArray()
        this.palette(defaultPalette);
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

    /**
     * Sets the weight of the path.
     * @param {number} weight - Weight of the path in px.
     */
    weight(weight: number) {
        this._weight = weight;
        return this;
    }


    /**
     * Sets the weight function for the path.
     * @param {(a: number, b: number) => number} weightFunc - Weight Function for the path in px.
     */
     weightFunc(weightFunc: (a: number, b: number) => number) {
        this._weightFunc = weightFunc;
        return this;
    }

    /**
     * Sets the width of the outline around the path.
     * @param {number} outlineWidth - Width of the outline in px.
     */
    outlineWidth(outlineWidth: number) {
        this._outlineWidth = outlineWidth;
        return this;
    }

    /**
     * Sets the color of the outline around the path.
     * @param {string} outlineColor - A CSS color value.
     */
    outlineColor(outlineColor: string) {
        this._outlineColor = outlineColor;
        return this;
    }

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

    /**
     * Sets the value used at the start of the palette gradient.
     * @param {number} min
     */
    min(min: number) {
        this._min = min;
        return this;
    }

    /**
     * Sets the value used at the end of the palette gradient.
     * @param {number} max
     */
    max(max: number) {
        this._max = max;
        return this;
    }

    /**
     * A path to rander as a hotline.
     * @typedef Array.<{x:number, y:number, z:number}> Path - Array of x, y and z coordinates.
     */

    /**
     * Sets the data that gets drawn on the canvas.
     * @param {(Path|Path[])} data - A single path or an array of paths.
     */
    data(data: HotlineData[]) {
        this._data = data;
        return this;
    }

    /**
     * Adds a path to the list of paths.
     * @param {Path} path
     */
    add(path: HotlineData) {
        this._data.push(path);
        return this;
    }

    /**
     * Draws the currently set paths.
     */
    _draw() {
        const ctx = this._ctx;

        ctx.globalCompositeOperation = 'source-over';
        ctx.lineCap = 'round';

        return this;
    }

    /**
     * Gets the RGB values of a given z value of the current palette.
     * @param {number} value - Value to get the color for, should be between min and max.
     * @returns {[number, number, number]} The RGB values as an array [r, g, b]
     */
    getRGBForValue(value: number): [number, number, number] {
        var valueRelative = Math.min(Math.max((value - this._min) / (this._max - this._min), 0), 0.999);
        var paletteIndex = Math.floor(valueRelative * 256) * 4;

        return [
            this._palette[paletteIndex],
            this._palette[paletteIndex + 1],
            this._palette[paletteIndex + 2]
        ];
    }

    getWeight(a: number, b: number) {
        return this._weightFunc ? this._weightFunc(a, b) : this._weight
    }
}

export default Hotline;