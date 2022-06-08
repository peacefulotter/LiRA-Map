
import { HotlineOptions, WayConditions } from "../../../models/path";
import RGB from "../utils/RGB";
import Hotline from "./Hotline";


export type DistInput = [number, number][]

export interface DistPoint { x: number, y: number, i: number, way_dist: number };
export type DistData = DistPoint[]

interface Hole {
    gradient: CanvasGradient;
    start: DistPoint;
    end: DistPoint;
    gradient_dist: number; 
}


export default class DistHotline extends Hotline<DistData> {

    conditions: WayConditions;

    constructor(conditions: WayConditions, options?: HotlineOptions) {
        super(options)
        this.conditions = conditions;
    }

    setConditions(conditions: WayConditions)
    {
        this.conditions = conditions
        console.log(conditions);
    }

    _drawHotline(): void 
    {
        console.log('\n\n\n');
        
        const dataLength = this._data.length

        let prevRGB: RGB | null = null;
        let holes: Hole[] = []

        for (let i = 0; i < dataLength; i++) 
        {
            const path = this._data[i] as any;
            
            for (let j = 1; j < path.length; j++) 
            {
                const pointStart = path[j - 1];
                const pointEnd = path[j];
                
                if ( pointStart.i !== pointEnd.i )
                    [holes, prevRGB] = this._addGradient(pointStart, pointEnd, prevRGB, holes);
            }
        }
    }

    calcColor(gradient: CanvasGradient, a: DistPoint, b: DistPoint, rgbaA: RGB, rgbB: RGB, edge_dist: number, gradient_dist: number)
    {
        const A = (1 - a.way_dist)
        const B =  (1 - b.way_dist) + edge_dist
        const C = (A + B)
        const color = rgbaA.mul( A / C ).add( rgbB.mul( B / C ) )
        this._addColorGradient( gradient, color, gradient_dist )
    }

    resolveHoles( ctx: CanvasRenderingContext2D, holes: Hole[], a: RGB, b: RGB, incr: number )
    {
        const n = 2 * holes.length + 1 - incr
        console.log('SOLVING', holes.length, n, a, b);
        
        holes.forEach( ({gradient, start, end}, x) => {
            const _x = 2 * x
            const s: RGB =  b.sub( a ).mul( _x / n ).add( a )           //  (_x / n) * (b + a) - a;
            const e: RGB = b.sub( a ).mul( (_x + 1) / n ).add( a ) // ((_x + 1) / n) * (b + a) - a;
            console.log(...s.get(), ...e.get());
            
            this._addColorGradient(gradient, s, 0)
            this._addColorGradient(gradient, e, 1)
            this.drawGradient( ctx, gradient, start, end )
        })
    }

    drawGradient(ctx: CanvasRenderingContext2D, gradient: CanvasGradient, pointStart: DistPoint, pointEnd: DistPoint)
    {
        ctx.beginPath();
        ctx.lineWidth = this._weight + (this.isHover ? 4 : 0)
        ctx.strokeStyle = gradient;
        ctx.moveTo(pointStart.x, pointStart.y);
        ctx.lineTo(pointEnd.x, pointEnd.y); 
        ctx.stroke();
        ctx.closePath()
    }

    _addGradient(start: DistPoint, end: DistPoint, prev: RGB | null, holes: Hole[] ): [Hole[], RGB | null]
    {
        const ctx = this._ctx;
        if ( ctx === undefined ) return [[], null];

        const gradient: CanvasGradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
        const [first, last] = this.computeGradient(gradient, start, end, prev)

        console.log(holes.length, prev, first, last);

        const hole: Hole = { gradient, start, end, gradient_dist: 0 }

        if ( holes.length > 0 && prev !== null && first !== null )
        {
            if (last !== null ) // first and last are not null => solve all holes
            {
                this.resolveHoles(ctx, holes, prev, first, 1)
            }
            else // last is null => solve all holes, but cur is a new one
            {
                this.resolveHoles(ctx, holes, prev, first, 0)
                return [ [hole], first ]
            }
        } 
        // new hole + can't solve any
        else if ( first === null && last === null )
            return [[...holes, hole], prev]

        this.drawGradient(ctx, gradient, start, end)

        return [[], last]
    }

    computeGradient(gradient: CanvasGradient, pointStart: DistPoint, pointEnd: DistPoint, prev: RGB | null): [RGB | null, RGB | null] 
    {
        const start_dist = pointStart.way_dist
        const end_dist = pointEnd.way_dist

        let first: RGB | null = null;
        let last: RGB | null = null;
    
        for ( let i = 0; i < this.conditions.length; i++ )
        {
            const { way_dist, value } = this.conditions[i]            

            if ( way_dist < start_dist )
                continue
            else if ( way_dist > end_dist )
                return [first, last]

            const rgb = this.getRGBForValue(value);
            const color = this.isHover ? new RGB(255, 0, 0) : rgb
            const dist = (way_dist - start_dist) / (end_dist - start_dist)

            this._addColorGradient(gradient, color, dist)

            if ( first === null ) 
            {
                first = color
                if ( prev !== null )
                    this._addColorGradient(gradient, prev, 0)
            }
            else
                last = color
        }

        return [first, last]
    }
}



