import L from 'leaflet'
import 'leaflet-dvf'
import { FC, useEffect } from "react";
import { GeoJSONProps, useMap } from "react-leaflet";

import { Condition } from '../../../models/path';

interface IGeoJSON {
    data: GeoJSONProps;
    conditions: Condition[]
}

const interpolateColor = (value: number) => `rgb(0, 0, 255)`

// rgba?
// vector?
const toGradient = (conditions: Condition[]) => {
    return {
        vector: [
            ['0%', '50%'],
            ['100%', '50%']
        ],
        stops: conditions.map( ({way_dist, value}) => ({
            offset: `${way_dist * 100}%`,
            style: { 
                color: interpolateColor(value), 
                opacity: 1 
            }
        }) ), 
    };
};

const GeoJSON: FC<IGeoJSON> = ( { data, conditions } ) => {
    const map = useMap()


    useEffect( () => {
        // const dataLayer = L.ChoroplethDataLayer(data, {
        //     recordsField: 'features',
        //     locationMode: L.LocationModes.GEOJSON,
        //     layerOptions: {
        //         color: "#000000",
        //         fillOpacity: 0.7,
        //         opacity: 1,
        //         weight: 0
        //     },
        //     showLegendTooltips: false,
        //     displayOptions: {
        //         "properties.gradient_stops": {
        //             gradient: toGradient(conditions)
        //         }
        //     }
        // });

    
        // map.addLayer(dataLayer);

        // return () => {
        //     dataLayer.remove()
        // }
    }, [])
    
    return null;
}

export default GeoJSON;