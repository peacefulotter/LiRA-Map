
import { HotlineOptions, WayConditions } from "../../../models/path";
import Hotline from "./Hotline";


export type DistInput = [number, number][]

export interface DistPoint { x: number, y: number, i: number };
export type DistData = DistPoint[]


export default class DistHotline extends Hotline<DistData> {

    conditions: WayConditions;

    constructor(conditions: WayConditions, options?: HotlineOptions) {
        super(options)
        this.conditions = conditions;
    }

    setConditions(conditions: WayConditions)
    {
        this.conditions = conditions
    }

    _drawHotline(): void 
    {
        const dataLength = this._data.length

        for (let i = 0; i < dataLength; i++) 
        {
            const path = this._data[i] as any;
            
            for (let j = 1; j < path.length; j++) 
            {
                const pointStart = path[j - 1];
                const pointEnd = path[j];

                // console.log('draw', pointStart, pointEnd);
                
                if ( pointStart.i !== pointEnd.i )
                    this._addGradient(pointStart, pointEnd);
            }
        }
       
    }

    _addGradient(pointStart: DistPoint, pointEnd: DistPoint) {

        if ( this._ctx === undefined ) return;

        const ctx = this._ctx;
        ctx.beginPath();

        const weight = this.getWeight(pointStart.i, pointEnd.i) 
        ctx.lineWidth = weight + (this.isHover ? 4 : 0)

        const gradient: CanvasGradient = ctx.createLinearGradient(pointStart.x, pointStart.y, pointEnd.x, pointEnd.y);
        this.computeGradient(gradient, pointStart, pointEnd)

        ctx.strokeStyle = gradient;
        ctx.moveTo(pointStart.x, pointStart.y);
        ctx.lineTo(pointEnd.x, pointEnd.y); 
        ctx.stroke();
        ctx.closePath()
    }

    computeGradient(gradient: CanvasGradient, pointStart: DistPoint, pointEnd: DistPoint) 
    {
        for ( let i = 0; i < this.conditions.length; i++ )
        {
            // const point = this.projectedData[0][k]
            const { way_dist, value } = this.conditions[i]

            const rgb = this.getRGBForValue(value);
            this.isHover 
                ? this._addColorGradient(gradient, [255, 0, 0], way_dist)
                : this._addColorGradient(gradient, rgb, way_dist)

            // if ( this.dotHoverIndex )
            // {
            //     const hoverPoint = ???;  // this.projectedData[0][this.dotHoverIndex];
            //     const opacity = Math.max(1 - (Math.abs(this.dotHoverIndex - k) / (deltaDist * 10)), 0)
            //     const color = this.getRGBForValue(hoverPoint.z);
            //     gradient.addColorStop(dist, 'rgba(' + color.join(',') + ',' + opacity + ')');
            // }
            // else
            //     this._addColorGradient(gradient, rgb, dist)
        }
    }
}



