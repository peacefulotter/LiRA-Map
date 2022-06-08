
import { ConditionPoint, HotlineOptions, WayConditions } from "../../../models/path";
import RGB from "../utils/RGB";
import Hotline from "./Hotline";


export type DistInput = [number, number][]

export interface DistPoint { x: number, y: number, i: number, way_dist: number };
export type DistData = DistPoint[]

type Edge = RGB;

export default class DistHotline extends Hotline<DistData> {

    conditionss: WayConditions[];
    way_ids: string[];
    way_lengths: number[];
    edgess: Edge[][];

    constructor(conditionss: WayConditions[], way_ids: string[], way_lengths: number[], options?: HotlineOptions) {
        super(options)
        this.conditionss = conditionss;
        this.way_ids = way_ids;
        this.way_lengths = way_lengths;
        this.edgess = [];
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
            const way_id = this.way_ids[i];
            const way_length = this.way_lengths[i];
            
            for (let j = 1; j < path.length; j++) 
            {
                const start = path[j - 1];
                const end = path[j];
                
                const gradient = this._addGradient(ctx, start, end, conditions, way_id);
                
                this._addColorGradient(gradient, edges[start.i], 0, way_id)
                this._addColorGradient(gradient, edges[end.i],   1, way_id)
                
                this.drawGradient(ctx, gradient, way_id, way_length, start, end)
            }
        }

    }

    drawGradient(
        ctx: CanvasRenderingContext2D, gradient: CanvasGradient, 
        way_id: string, way_length: number, 
        pointStart: DistPoint, pointEnd: DistPoint
    ) {
        ctx.beginPath();
        const hoverWeight = this.dotHover !== undefined 
            && this.dotHover.label === way_id 
            && (pointStart.way_dist * way_length) <= this.dotHover.x 
            && (pointEnd.way_dist * way_length) >= this.dotHover.x 
            ? 10
            : 0

        if ( this.dotHover !== undefined  && this.dotHover.label === way_id )
            console.log( pointStart.way_dist * way_length, this.dotHover.x, pointEnd.way_dist * way_length );
            
        ctx.lineWidth = this._weight + hoverWeight
        ctx.strokeStyle = gradient;
        ctx.moveTo(pointStart.x, pointStart.y);
        ctx.lineTo(pointEnd.x, pointEnd.y); 
        ctx.stroke();
        ctx.closePath()
    }

    _addGradient( ctx: CanvasRenderingContext2D, start: DistPoint, end: DistPoint, conditions: WayConditions, way_id: string ): CanvasGradient
    {

        const gradient: CanvasGradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
        this.computeGradient(gradient, start, end, conditions, way_id)
        return gradient
    }

    computeGradient(gradient: CanvasGradient, pointStart: DistPoint, pointEnd: DistPoint, conditions: WayConditions, way_id: string )
    {
        const start_dist = pointStart.way_dist
        const end_dist = pointEnd.way_dist
    
        for ( let i = 0; i < conditions.length; i++ )
        {
            const { way_dist, value } = conditions[i]      
            
            if ( way_dist < start_dist ) continue;
            else if ( way_dist > end_dist ) return;

            const rgb = this.getRGBForValue(value);
            const dist = (way_dist - start_dist) / (end_dist - start_dist)
            
            this._addColorGradient(gradient, rgb, dist, way_id)
        }
    }
}



