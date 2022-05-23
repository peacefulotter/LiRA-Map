
import Hotline from "./Hotline";

interface DistVal {
    dist: number;
    value: number;
}

export default class DistHotline extends Hotline {

    dists: DistVal[][]

    constructor(canvas: HTMLElement, dotHoverIndex: number | undefined, dists: DistVal[][]) {
        super(canvas, dotHoverIndex);
        this.dists = dists;
    }

    computeGradient(gradient: CanvasGradient, pointStart: any, pointEnd: any) 
    {

        const wayIndex = pointStart.i
        const segDists = this.dists[wayIndex] 

        for ( let i = 0; i < segDists.length; i++ )
        {
            // const point = this.projectedData[0][k]
            const { dist, value } = segDists[i]

            const rgb = this.getRGBForValue(value);
            this._addColorGradient(gradient, rgb, dist)

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



