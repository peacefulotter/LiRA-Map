
import L from 'leaflet'
import 'Leaflet.MultiOptionsPolyline'
import { FC, useEffect, useState } from 'react';

import '../../../assets/CustomHotline';
import useZoom from '../Hooks/useZoom';
import { DEFAULT_WIDTH, width } from '../../../assets/properties';
import { RendererProps } from '../../../models/renderers';

interface HotlineProps extends RendererProps {
    palette?: any
    zoomRange?: [number, number]
}

// const range = (n: number): number[] => { 
//     return Array.from( {length: n}, (elt, i) => i);
// }

// const getColor = (val: any): string => {
//     const red: number = Math.min(val * 2, 1) * 255;
//     const green: number = (val < 0.5 ? val +  0.5 : 2 - val * 2) * 255;                 
//     return `rgb(${Math.round(red)}, ${Math.round(green)}, 0)`
//     // return `rgb(${i * 255}, 0, 0)`
// }

// const getOptions = (length: number, properties: PathProperties): PolylineOptions[] | PolylineOptionsFn => {
//     const dilatationFactor = properties.dilatationFactor || 1
//     const dilatation = (i: number) => 1 // Math.pow((i + length) / length, dilatationFactor)

//     return range(length)
//         .map(i => { return {
//             color: getColor(i / length),
//             weight: width(path[i]) * dilatation(i),
//             smoothFactor: 0,
//             lineJoin: 'bevel',
//             lineCap: 'butt'
//         } } )
// }


const Hotline: FC<HotlineProps> = ( { 
    path, properties, onClick,
    minY, maxY, 
    palette, zoomRange 
} ) => {

    const [coords, setCoords] = useState<[number, number, number][]>([])
    const [distances, setDistances] = useState<number[]>([])
    const [zoom, map] = useZoom()

    const options = {
        zoomRange: zoomRange || [12, 17],
        weight: properties.width || DEFAULT_WIDTH,
        weightFunc: (i: number) => {
            // console.log(zoom);
            // const formula = ((i * 10) / coords.length) + 4
            // const dilatation = (i: number) => Math.pow((i + length) / length, dilatationFactor)
            return width(path[i].properties, properties) // + Math.max(zoom / 5, 2)
        },
        outlineWidth: 0,
        palette: palette || {
            0.0: 'green',
            0.5: 'yellow',
            1.0: 'red'
        },
        min: minY || 0,
        max: maxY || 1,
        onclick: onClick ? onClick(0) : null
    }


    /**
     * COMPUTE GRADIENT
     */

    useEffect( () => {
        // const range = [12, 13, 14, 15, 16, 17]
        // const len = range.length;
        const tempCoords: [number, number, number][] = []
        const tempDistances: number[] = []
        const addVal = (i: number, dist: number) => {
            tempCoords.push([path[i].lat, path[i].lng, path[i].value || 0])
            tempDistances.push(dist)
        }
        addVal(0, 0)
        let totalDist = 0;
        for (let i = 1; i < path.length; i++ ) 
        {
            const lat1 = path[i - 1].lat;
            const lng1 = path[i - 1].lng;
            const lat2 = path[i].lat;
            const lng2 = path[i].lng;
            const dist = Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1)) || 0
            // console.log(i, dist, totalDist, lat1, lng1, lat2, lng2);
            totalDist += dist;
            addVal(i, totalDist)
        }

        setCoords(tempCoords)
        setDistances(tempDistances)
    }, [path])

    useEffect( () => {
        if (coords.length === 0) return;
        console.log(coords);
        const hl = L.Hotline( coords, options, distances )
        hl.addTo(map)
        return () => hl.remove()
    }, [coords])
        
    return null;
}

export default Hotline;