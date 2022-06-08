
import { start } from "repl";
import { ConditionPoint, HotlineOptions, WayConditions } from "../../../models/path";
import RGB from "../utils/RGB";
import Hotline from "./Hotline";


export type DistInput = [number, number][]

export interface DistPoint { x: number, y: number, i: number, way_dist: number };
export type DistData = DistPoint[]

// interface Edge {
//     gradient: CanvasGradient;
//     start: DistPoint;
//     end: DistPoint;
//     cur: Condition | null;
//     grad_dist: 0 | 1; 
// }

interface Condition {
    way_dist: number;
    rgb: RGB;
}

type Edge = RGB;

export default class DistHotline extends Hotline<DistData> {

    conditionss: WayConditions[];
    edgess: Edge[][];

    constructor(conditionss: WayConditions[], options?: HotlineOptions) {
        super(options)
        this.conditionss = conditionss;
        this.edgess = []
    }

    private getEdges(conditionss: WayConditions[])
    {
        let i = 0

        const calcValue = (a: ConditionPoint, b: ConditionPoint, cur: DistPoint ) => {
            const A = 1 - (cur.way_dist - a.way_dist)
            const B = 1 - (cur.way_dist - b.way_dist)
            return (A * a.value + B * b.value) / (A + B)
        }

        const getValue = (d: DistPoint, conditions: WayConditions): number => {
            if ( d.way_dist === 0 ) return conditions[0].value
            else if ( d.way_dist === 1 ) return conditions[conditions.length - 1].value
            
            while ( conditions[i].way_dist <= d.way_dist && ++i < conditions.length ) {}
            return calcValue(conditions[Math.max(i - 1, 0)], conditions[i], d)
        }

        return this.projectedData.map( (data, j) => {
            i = 0;
            const conditions = conditionss[j]
            return data.map( d => this.getRGBForValue(getValue(d, conditions)) ) 
        })
    }

    setConditions(conditionss: WayConditions[])
    {
        this.conditionss = conditionss
        this.edgess = this.getEdges(conditionss)
    }

    _drawHotline(): void 
    {
        const ctx = this._ctx;
        if ( ctx === undefined ) return;
        
        const dataLength = this._data.length

        for (let i = 0; i < dataLength; i++) 
        {
            const path = this._data[i];
            const conditions = this.conditionss[i];
            const edges = this.edgess[i]
            
            for (let j = 1; j < path.length; j++) 
            {
                const start = path[j - 1];
                const end = path[j];
                
                const gradient = this._addGradient(ctx, start, end, conditions);
                
                this._addColorGradient(gradient, edges[start.i], 0)
                this._addColorGradient(gradient, edges[end.i],   1)

                this.drawGradient(ctx, gradient, start, end)
            }
        }

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

    _addGradient( ctx: CanvasRenderingContext2D, start: DistPoint, end: DistPoint, conditions: WayConditions ): CanvasGradient
    {

        const gradient: CanvasGradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
        this.computeGradient(gradient, start, end, conditions)
        return gradient
    }

    computeGradient(gradient: CanvasGradient, pointStart: DistPoint, pointEnd: DistPoint, conditions: WayConditions )
    {
        const start_dist = pointStart.way_dist
        const end_dist = pointEnd.way_dist
    
        for ( let i = 0; i < conditions.length; i++ )
        {
            const { way_dist, value } = conditions[i]      
            
            if ( way_dist < start_dist ) continue;
            else if ( way_dist > end_dist ) return;

            const rgb = this.getRGBForValue(value);
            const color = this.isHover ? new RGB(255, 0, 0) : rgb
            const dist = (way_dist - start_dist) / (end_dist - start_dist)
            
            this._addColorGradient(gradient, color, dist)
        }
    }
}



