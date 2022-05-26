
import Hotline from "./Hotline";


export type LatLngInputPoint = [number, number, number]
export type LatLngInput = LatLngInputPoint[]

export interface LatLngPoint { x: number, y: number, z: number, i: number };
export type LatLngData = LatLngPoint[]

export default class LatLngHotline extends Hotline<LatLngData> {

    constructor(canvas: HTMLElement, dotHoverIndex: number | undefined) {
        super(canvas, dotHoverIndex);
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



