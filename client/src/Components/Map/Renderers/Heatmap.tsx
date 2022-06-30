
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from 'leaflet'
import "leaflet.heat"

import { Palette } from "../../../models/graph";

type IHeatmap<T> = {
    data: T[];
    getLat: (t: T) => number;
    getLng: (t: T) => number;
    getVal: (t: T) => number;
    max: number;
    radius?: number;
    palette?: Palette
};

type HeatmapType = <T>(arg: IHeatmap<T>) => null;

const DEFAULT_HEATMAP_PALETTE: Palette = [
    { r: 0,   g: 0,   b: 255, t: 0   },
    { r: 255, g: 255, b: 255, t: 0.5 },
    { r: 255, g: 0,   b: 0,   t: 1   },
]

const toHeatPalette = (p: Palette) => p.reduce( (acc, cur) => {
    acc[cur.t] = `rgb(${cur.r}, ${cur.g}, ${cur.b})`
    return acc;
}, {} as {[key: number]: string} )

const DEFAULT_RADIUS = 10;

const Heatmap: HeatmapType = ( { data, getLat, getLng, getVal, max, radius, palette } ) => {
    
    const map = useMap()

    console.log(data);

    useEffect( () => {
        const points = data.map( p => [getLat(p), getLng(p), getVal(p)] );

        console.log(toHeatPalette(palette || DEFAULT_HEATMAP_PALETTE));
        
        const layer = (L as any).heatLayer(points, {
            max: max,
            radius: radius || DEFAULT_RADIUS,
            gradient: toHeatPalette(palette || DEFAULT_HEATMAP_PALETTE)
        })
        layer.addTo(map);
        return () => layer.remove()
    }, [data, max, radius, palette] )

    return null;
}

export default Heatmap;
