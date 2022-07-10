import  { useEffect, useRef, useState } from "react";
import { Palette } from "react-leaflet-hotline";

import { RENDERER_PALETTE } from "../Components/Map/constants";
import PaletteEditor from "../Components/Palette/PaletteEditor";
import MapWrapper from "../Components/Map/MapWrapper";
import Ways from "../Components/RoadCondition/Ways";
import Graph from "../Components/Graph/Graph";

import { Bounds, Condition } from "../models/path";

import { getConditions } from "../queries/conditions";

import { GraphProvider } from "../context/GraphContext";

import { GraphData, Plot } from "../assets/graph/types";

import "../css/road_conditions.css";


const RoadConditions = () => {
    
    const [palette, setPalette] = useState<Palette>([])
    const [plot, setPlot] = useState<Plot>()

    const ref = useRef<HTMLDivElement>(null)
    const [width, setWidth] = useState<number>()

    const type = {
        name: 'IRI',
        min: 0,
        max: 10,
        grid: true,
        samples: 40
    }

    const onClick = (way_id: string, way_length: number) => {
        getConditions(way_id, type.name, (wc: Condition[]) => {
            const bounds: Bounds = {
                minX: 0,
                maxX: way_length,
                minY: type.min,
                maxY: type.max,
            }
            const data: GraphData = wc.map( p => [p.way_dist * way_length, p.value] )
            const label = way_id
            setPlot( { bounds, data, label } )
        })
    }

    useEffect( () => {
        if ( ref.current === null ) return;
        const { width: w } = ref.current.getBoundingClientRect()
        setWidth(w)
    }, [ref])


    return (
        <GraphProvider>
        <div className="ml-wrapper">
            <div className="ml-map" ref={ref}>
                <PaletteEditor 
                    defaultPalette={RENDERER_PALETTE}
                    width={width}
                    cursorOptions={{scale: type.max, grid: type.grid, samples: type.samples}}
                    onChange={setPalette} />

                <MapWrapper>
                    <Ways palette={palette} type={type.name} onClick={onClick}/>
                </MapWrapper>
            </div>

            <div className="ml-graph">
                <Graph 
                    labelX="distance (m)" 
                    labelY="IRI"
                    palette={palette}
                    plots={plot ? [plot] : []}
                />
            </div>
        </div>

        </GraphProvider> 
    );
}

export default RoadConditions;