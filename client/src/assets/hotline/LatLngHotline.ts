import Hotline from "./core";

    

export default class LatLngHotline extends Hotline {
    /**
     * Draws the outline of the graphs.
     * @private
     */
    _drawOutline(ctx: any) {
        var i, j, dataLength, path, pathLength, pointStart, pointEnd;

        if (this._outlineWidth) {
            for (i = 0, dataLength = this._data.length; i < dataLength; i++) {
                path = this._data[i];

                for (j = 1, pathLength = path.length; j < pathLength; j++) {
                    pointStart = path[j - 1];
                    pointEnd = path[j];

                    ctx.lineWidth = this._outlineWidth;
                    ctx.strokeStyle = this._outlineColor;
                    ctx.beginPath();
                    ctx.moveTo(pointStart.x, pointStart.y);
                    ctx.lineTo(pointEnd.x, pointEnd.y);
                    ctx.stroke();
                }
            }
        }
    }

    _addColorGradient(gradient: any, rgb: number[], dist: number) {
        gradient.addColorStop(dist, 'rgb(' + rgb.join(',') + ')');
    }

    _addGradient(ctx: any, j: any, pointStart: any, pointEnd: any) {

        const weight = this.getWeight(pointStart.i, pointEnd.i) 
        ctx.lineWidth = weight + (this.dotHoverIndex ? 4 : 0)

        // Create a gradient for each segment, pick start and end colors from palette gradient
        const gradient = ctx.createLinearGradient(pointStart.x, pointStart.y, pointEnd.x, pointEnd.y);

        const deltaIndex = pointEnd.i - pointStart.i
        const deltaDist = pointEnd.d - pointStart.d

        const hoverPoint = this.projectedData[0][this.dotHoverIndex || 0];

        for ( let k = pointStart.i; k <= pointEnd.i; k++ )
        {
            const point = this.projectedData[0][k]
            const dist = (point.i - pointStart.i) / (deltaIndex !== 0 ? deltaIndex : 1)
            // (point.d - pointStart.d) / (deltaDist !== 0 ? deltaDist : 1)

            const rgb = this.getRGBForValue(point.z);

            if ( this.dotHoverIndex )
            {
                const opacity = Math.max(1 - (Math.abs(this.dotHoverIndex - k) / deltaIndex), 0)
                const color = this.getRGBForValue(hoverPoint.z);
                gradient.addColorStop(dist, 'rgba(' + color.join(',') + ',' + opacity + ')');
            }
            else
                this._addColorGradient(gradient, rgb, dist)
        }

        ctx.strokeStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(pointStart.x, pointStart.y);
        ctx.lineTo(pointEnd.x, pointEnd.y);
        ctx.stroke();
    }

    /**
     * Draws the color encoded hotline of the graphs.
     * @private
     */
    _drawHotline(ctx: any) {
        var i, j, dataLength, path, pathLength, pointStart, pointEnd;

        for (i = 0, dataLength = this._data.length; i < dataLength; i++) 
        {
            path = this._data[i];
            for (j = 1, pathLength = path.length; j < pathLength; j++) 
            {
                pointStart = path[j - 1];
                pointEnd = path[j];

                if ( pointStart.i !== pointEnd.i )
                    this._addGradient(ctx, j, pointStart, pointEnd);
            }
        }
    }
}



