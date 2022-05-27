
import Hotline from "./Hotline";


export type LatLngInputPoint = [number, number, number]
export type LatLngInput = LatLngInputPoint[]

export interface LatLngPoint { x: number, y: number, z: number, i: number };
export type LatLngData = LatLngPoint[]

export default class LatLngHotline extends Hotline<LatLngData> {

    constructor(canvas: HTMLElement, dotHoverIndex: number | undefined) {
        super(canvas, dotHoverIndex);
    }

    _drawHotline(): void 
    {
        for (let i = 0, dataLength = this._data.length; i < dataLength; i++) 
        {
            const path = this._data[i] as any;
            for (let j = 1, pathLength = path.length; j < pathLength; j++) 
            {
                const pointStart = path[j - 1];
                const pointEnd = path[j];

                if ( pointStart.i !== pointEnd.i )
                    this._addGradient(pointStart, pointEnd);
            }
        }
    }

    _addGradient(pointStart: any, pointEnd: any) {

        const ctx = this._ctx;

        const weight = this.getWeight(pointStart.i, pointEnd.i) 
        ctx.lineWidth = weight + (this.dotHoverIndex ? 4 : 0)

        // Create a gradient for each segment, pick start and end colors from palette gradient
        const gradient: CanvasGradient = ctx.createLinearGradient(pointStart.x, pointStart.y, pointEnd.x, pointEnd.y);

       this.computeGradient(gradient, pointStart, pointEnd)

        ctx.strokeStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(pointStart.x, pointStart.y);
        ctx.lineTo(pointEnd.x, pointEnd.y);
        ctx.stroke();
    }

    computeGradient(gradient: CanvasGradient, pointStart: LatLngPoint, pointEnd: LatLngPoint) 
    {

        const deltaIndex = pointEnd.i - pointStart.i

        for ( let k = pointStart.i; k <= pointEnd.i; k++ )
        {
            const point = this.projectedData[0][k]
            const dist = (point.i - pointStart.i) / (deltaIndex !== 0 ? deltaIndex : 1)

            const rgb = this.getRGBForValue(point.z);

            if ( this.dotHoverIndex )
            {
                const hoverPoint = this.projectedData[0][this.dotHoverIndex];
                const opacity = Math.max(1 - (Math.abs(this.dotHoverIndex - k) / deltaIndex), 0)
                const color = this.getRGBForValue(hoverPoint.z);
                gradient.addColorStop(dist, 'rgba(' + color.join(',') + ',' + opacity + ')');
            }
            else
                this._addColorGradient(gradient, rgb, dist)
        }
    }
}



