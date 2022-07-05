import L from 'leaflet'
import { useEffect } from 'react';

import { fixProperties } from '../../../assets/properties';
import { useGraph } from '../../../context/GraphContext';
import { PointData } from '../../../models/path';
import { Renderer } from '../../../models/renderers';
import useCanvas from '../Hooks/useCanvas';
import getColor from '../color';

const Hotpoints: Renderer = ( { path, properties, onClick } ) => { 

    const [map, canvas] = useCanvas();
    const { minY, maxY } = useGraph()

    useEffect(() => {
        path.forEach( (p: PointData, i: number) => {
            const mappedValue: number = ((p.value || -9999) - (minY || 0)) / ((maxY || 1) - (minY || 0))
            const { width, weight, opacity } = fixProperties(p.properties, properties)
            return L.circle( [p.lat, p.lng], { 
                renderer: canvas, 
                radius: width,
                color: getColor(mappedValue, properties.color, i / path.length),
                weight: weight,
                opacity: opacity,
            } ).on("click", onClick ? onClick(i) : () => {}).addTo(map);
        } )
    }, [canvas, map, minY, maxY, onClick, path, properties])

    return <></>;
}

export default Hotpoints