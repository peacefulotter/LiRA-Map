import  { useState } from "react";

import PaletteEditor from "../Components/Palette/PaletteEditor";
import MapWrapper from "../Components/Map/MapWrapper";
import Ways from "../Components/RoadCondition/Ways";
import Panel from "../Components/RoadCondition/Panel";
import Graph from "../Components/Graph/Graph";

import { Bounds, Condition } from "../models/path";
import { GraphData, Plot } from "../models/graph";
import { TRGB } from "react-gradient-hook/lib/types";

import { getConditions } from "../queries/conditions";

import { GraphProvider } from "../context/GraphContext";

import { DEFAULT_PALETTE } from "../assets/properties";

import "../css/road_conditions.css";


const RoadConditions = () => {
    
    const [palette, setPalette] = useState<TRGB[]>([])
    const [plot, setPlot] = useState<Plot>()

    const type = {
        name: 'IRI',
        min: 0,
        max: 10,
        grid: true,
        samples: 40
    }

    const onClick = (way_id: string, way_length: number) => () => {

        getConditions(way_id, type.name, (wc: Condition[]) => {

            const bounds: Bounds = {
                minX: 0,
                maxX: way_length,
                minY: type.min,
                maxY: type.max,
            }
    
            const data: GraphData = wc.map((p: Condition, i: number) => [p.way_dist * way_length, p.value, i])
            const label = way_id

            setPlot( { bounds, data, label } )
        })
    }


    return (
        <GraphProvider>
        <div className="ml-wrapper">
            <PaletteEditor 
                defaultPalette={DEFAULT_PALETTE}
                cursorOptions={{scale: type.max, grid: type.grid, samples: type.samples}}
                onChange={setPalette} />
            <div className="ml-map">
                <MapWrapper>
                    <Ways palette={palette} type={type.name} onClick={onClick}/>
                </MapWrapper>
                {/* <Panel measurements={measurements} onClick={onClick} fetchWays={fetchWays}/> */}
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