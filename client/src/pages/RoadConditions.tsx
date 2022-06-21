import  { useState } from "react";

import PaletteEditor from "../Components/Palette/PaletteEditor";
import MapWrapper from "../Components/Map/MapWrapper";
import Ways from "../Components/RoadCondition/Ways";
import Panel from "../Components/RoadCondition/Panel";
import Graph from "../Components/Graph/Graph";

import { Bounds, ConditionPoint, WayConditions } from "../models/path";
import { GraphData, Plot } from "../models/graph";
import { TRGB } from "react-gradient-hook/lib/types";

import { getConditions } from "../queries/conditions";

import { GraphProvider } from "../context/GraphContext";

import { DEFAULT_PALETTE } from "../assets/properties";

import "../css/road_conditions.css";


const RoadConditions = () => {
    
    const [palette, setPalette] = useState<TRGB[]>([])
    const [plot, setPlot] = useState<Plot>()

    const onClick = (way_id: string, way_length: number) => () => {

        getConditions(way_id, 'IRI', (wc: WayConditions) => {

            const bounds: Bounds = {
                minX: 0, // Math.min(...zoom.conditions.map(c => c.way_dist)),
                maxX: way_length,
                minY: 0, // Math.min(...zoom.conditions.map(c => c.value)),
                maxY: 10,// Math.max(...zoom.conditions.map(c => c.value)),
            }
    
            const data: GraphData = wc.map((p: ConditionPoint, i: number) => [p.way_dist * way_length, p.value, i])
            const label = way_id

            setPlot( { bounds, data, label } )
        })
    }


    return (
        <GraphProvider>
        <div className="ml-wrapper">
            <PaletteEditor 
                defaultPalette={DEFAULT_PALETTE} 
                cursorOptions={{scale: 10, grid: true, samples: 40}}
                onChange={setPalette} />
            <div className="ml-map">
                <MapWrapper>
                    <Ways palette={palette} onClick={onClick}/>
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