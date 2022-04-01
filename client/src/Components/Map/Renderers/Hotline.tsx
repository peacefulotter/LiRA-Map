
import L from 'leaflet'
import 'Leaflet.MultiOptionsPolyline'
import { FC, useEffect, useState } from 'react';

import { EventRendererProps, PointData } from "../../../models/models";
import '../../../assets/CustomHotline';
import useZoom from '../Hooks/useZoom';
import { DEFAULT_WIDTH, width } from '../../../assets/properties';

interface HotlineProps extends EventRendererProps {
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
    minValue, maxValue, 
    palette, zoomRange 
} ) => {

    const [coords, setCoords] = useState<[number, number, number][][]>([])
    const [zoom, map] = useZoom()

    const options = {
        zoomRange: zoomRange || [12, 17],
        weight: properties.width || DEFAULT_WIDTH,
        weightFunc: (i: number) => {
            // console.log(zoom);
            // const formula = ((i * 10) / coords.length) + 4
            // const dilatation = (i: number) => Math.pow((i + length) / length, dilatationFactor)
            return width(path[i].properties, properties) + zoom - 7
        },
        outlineWidth: 0,
        palette: palette || {
            0.0: 'green',
            0.5: 'yellow',
            1.0: 'red'
        },
        min: minValue || 0,
        max: maxValue || 1,
        onclick: onClick(0)
    }


    /**
     * COMPUTE GRADIENT
     */

    useEffect( () => {
        const range = [12, 13, 14, 15, 16, 17]
        const len = range.length;
        setCoords(
            range.map( zoom =>
                path.map( (point: PointData) => 
                    [point.lat, point.lng, point.value || 0]
                )
            )
        )
    }, [])

    useEffect( () => {
        if (coords.length === 0) return;
        const minZoom = options.zoomRange[0];
        const maxZoom = options.zoomRange[1]
        const zoomIndex = Math.max(minZoom, Math.min(maxZoom, zoom)) - minZoom;
        const hl = L.Hotline( coords[zoomIndex], zoom, options )
        hl.addTo(map)
        return () => hl.remove()
    }, [zoom, coords])
        
    return <></>
}

export default Hotline;