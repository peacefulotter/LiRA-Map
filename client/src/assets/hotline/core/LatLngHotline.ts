
import Hotline, { HotlinePoint } from "./Hotline";

    
export default class LatLngHotline extends Hotline {

    constructor(canvas: HTMLElement, dotHoverIndex: number | undefined) {
        super(canvas, dotHoverIndex);
    }

    computeGradient(gradient: CanvasGradient, pointStart: HotlinePoint, pointEnd: HotlinePoint) 
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



