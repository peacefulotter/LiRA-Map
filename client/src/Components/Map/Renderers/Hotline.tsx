
import L from 'leaflet'
// import 'leaflet-hotline'
import '../../../assets/CustomLeafletHotline';
import 'Leaflet.MultiOptionsPolyline'
import { PolylineOptions, PolylineOptionsFn } from 'Leaflet.MultiOptionsPolyline';
import { FC, useEffect, useState } from 'react';

import { EventRendererProps, PathProperties, PointData } from "../../../assets/models";
import useCanvas from './useCanvas';
import { useMapEvents } from 'react-leaflet';

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

    const [zoom, setZoom] = useState<number>(0)

    const map = useMapEvents({
        zoom: () => setZoom(map.getZoom())
    })

    useEffect(() => {
        const p = palette || {
            0.0: 'green',
            0.5: 'yellow',
            1.0: 'red'
        }

        // the Z value determines the color
        const coords: [number, number, number][][] = [12, 13, 14, 15, 16]
            .map(zoom => {
                return path.data
                    .map( (point: PointData) => 
                        [point.pos.lat, point.pos.lng, point.value || 0] )
            } )

        const options = {
            weight: properties.boldness || properties.size,
            weightFunc: (i: number) => {
                console.log(zoom);
                
                // const formula = ((i * 10) / coords.length) + 4
                return 4 + zoom - 12
            },
            outlineWidth: 0,
            palette: p,
            min: path.minValue || 0,
            max: path.maxValue || 1,
            onclick: onClick(0)
        }

        const hl = L.Hotline( coords, zoom, options )
        hl.addTo(map)
        return () => hl.remove()
    }, [zoom]) 

    return <></>;
}

export default Hotline;