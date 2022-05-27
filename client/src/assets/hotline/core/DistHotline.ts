
import { text } from "d3";
import { RoadConditions } from "../../../models/path";
import Hotline from "./Hotline";

interface DistVal {
    dist: number;
    value: number;
}


export type DistInputPoint = [number, number]
export type DistInput = DistInputPoint[]

export interface DistPoint { x: number, y: number, z: number, i: number };
export type DistData = DistPoint[]


export default class DistHotline extends Hotline<DistData> {

    conditions: RoadConditions;

    constructor(canvas: HTMLElement, dotHoverIndex: number | undefined, conditions: RoadConditions) {
        super(canvas, dotHoverIndex);
        this.conditions = conditions;
    }

    _drawHotline(): void 
    {
        const ctx = this._ctx;
        const dataLength = this._data.length

        ctx.beginPath();

        for (let i = 0; i < dataLength; i++) 
        {
            const path = this._data[i] as any;
            for (let j = 1, pathLength = path.length; j < pathLength; j++) 
            {
                const pointStart = path[j - 1];
                const pointEnd = path[j];

                console.log(pointStart, pointEnd);
                

                if ( pointStart.i !== pointEnd.i )
                    this._addGradient(pointStart, pointEnd);
            }
        }

        ctx.closePath()
    }

    _addGradient(pointStart: any, pointEnd: any) {

        const ctx = this._ctx;

        const weight = this.getWeight(pointStart.i, pointEnd.i) 
        ctx.lineWidth = weight + (this.dotHoverIndex ? 4 : 0)

        const gradient: CanvasGradient = ctx.createLinearGradient(pointStart.x, pointStart.y, pointEnd.x, pointEnd.y);
        this.computeGradient(gradient, pointStart, pointEnd)

        ctx.strokeStyle = gradient;
        ctx.moveTo(pointStart.x, pointStart.y);
        ctx.lineTo(pointEnd.x, pointEnd.y);
        ctx.stroke();
    }

    computeGradient(gradient: CanvasGradient, pointStart: DistPoint, pointEnd: DistPoint) 
    {
        for ( let i = 0; i < this.conditions.length; i++ )
        {
            // const point = this.projectedData[0][k]
            const { way_dist, value } = this.conditions[i]

            const rgb = this.getRGBForValue(value);
            this._addColorGradient(gradient, rgb, way_dist)

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



