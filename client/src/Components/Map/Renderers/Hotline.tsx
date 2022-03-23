
import L from 'leaflet'
// import 'leaflet-hotline'
import '../../../assets/CustomLeafletHotline';
import 'Leaflet.MultiOptionsPolyline'
import { PolylineOptions, PolylineOptionsFn } from 'Leaflet.MultiOptionsPolyline';
import { FC, useEffect } from 'react';

import { EventRendererProps, PathProperties, PointData } from "../../../assets/models";
import useCanvas from './useCanvas';

interface HotlineProps extends EventRendererProps {
    palette?: any
}

const range = (n: number): number[] => { 
    return Array.from( {length: n}, (elt, i) => i);
}

const getColor = (val: any): string => {
    const red: number = Math.min(val * 2, 1) * 255;
    const green: number = (val < 0.5 ? val +  0.5 : 2 - val * 2) * 255;                 
    return `rgb(${Math.round(red)}, ${Math.round(green)}, 0)`
    // return `rgb(${i * 255}, 0, 0)`
}

const getOptions = (length: number, properties: PathProperties): PolylineOptions[] | PolylineOptionsFn => {
    const weight = (properties.boldness || properties.size) + 3
    const dilatationFactor = properties.dilatation || 1
    const dilatation = (i: number) => 1 // Math.pow((i + length) / length, dilatationFactor)

    return range(length)
        .map(i => { return {
            color: getColor(i / length),
            weight: weight * dilatation(i),
            smoothFactor: 0,
            lineJoin: 'bevel',
            lineCap: 'butt'
        } } )
}

const Hotline: FC<HotlineProps> = ( { path, properties, palette, onClick } ) => {

    const [map, canvas] = useCanvas();

    useEffect(() => {
        const p = palette || {
            0.0: 'green',
            0.5: 'yellow',
            1.0: 'red'
        }

        const colorThresholds = 50

        // the Z value determines the color
        const coords: [number, number, number][] = path.data
            .map( (point: PointData) => [point.pos.lat, point.pos.lng, point.value || 0])

        console.log(L.Hotline);

        const hl = L.Hotline( coords, {
            weight: 4,
            weightFunc: (i: number) => {
                const formula = ((i * 3) / coords.length) + 4
                // console.log(i, formula);
                return formula
            },
            outlineWidth: 0,
            palette: p,
            min: path.minValue || 0,
            max: path.maxValue || 1,
            onclick: onClick(0)
        } )
        const hl2 = new hl( coords, {
            weight: 4,
            weightFunc: (i: number) => {
                const formula = ((i * 3) / coords.length) + 4
                // console.log(i, formula);
                return formula
            },
            outlineWidth: 0,
            palette: p,
            min: path.minValue || 0,
            max: path.maxValue || 1,
            onclick: onClick(0)
        } );
        hl2.addTo(map)
        // hl.addTo(map);
        
        // L.multiOptionsPolyline( path.data.map( p => p.pos ), {
        //     multiOptions: {
        //         optionIdxFn: function (latLng, prev, i) {
        //             const mappedValue = ((path.data[i].value || -9999) - (path.minValue || 0)) / ((path.maxValue || 1) - (path.minValue || 0))
        //             const a = Math.round(mappedValue * (colorThresholds - 1));
        //             return a
        //         },
        //         options: getOptions(colorThresholds, properties),
        //     },
        //     opacity: properties.opacity || 1.0,
        // }).addTo(map);
    }, [])

    return <></>;
}

export default Hotline;