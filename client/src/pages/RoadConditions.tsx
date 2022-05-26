import React, { useEffect, useState } from "react";

import MetadataPath from "../Components/Map/MetadataPath";
import MapWrapper from "../Components/Map/MapWrapper";
import Graph from "../Components/Graph/Graph";
import Panel from "../Components/RoadCondition/Panel";

import { Bounds, ConditionPoint, JSONProps, PointData, Way, WayConditions } from "../models/path";
import { GraphData, Palette } from "../models/graph";

import { get, post } from "../queries/fetch";

import { GraphProvider } from "../context/GraphContext";

import { DEFAULT_PALETTE } from "../assets/properties";

import "../css/road_conditions.css";
import { getConditions } from "../queries/conditions";
import RCHotline from "../Components/RoadCondition/RCHotline";


const IRIPalette: Palette = DEFAULT_PALETTE

interface FilterJSON { 
    p: JSONProps | undefined,
    rest: JSONProps[]
}


const RoadConditions = () => {
    const [ways, setWays] = useState<WayConditions[]>([])
    const [measurements, setMeasurements] = useState<string[]>([])

    useEffect( () => {
        get('/conditions/files', setMeasurements)
    }, [] )

    const addPath = (i: number) => {
        post('/conditions/file', { filename: measurements[i] }, (json: WayConditions) => {
            setWays( prev => [...prev, json] )
        } )
    }
    
    // const filterPath = (i: number): FilterJSON => {
    //     const n = measurements[i]
    //     return ways.reduce( (acc: FilterJSON, cur: JSONProps) => cur.properties.name === n 
    //         ? { p: cur, rest: acc.rest } 
    //         : { p: acc.p, rest: [...acc.rest, cur] } 
    //     , { p: undefined, rest: [] }  )
    // }

    // const delPath = (i: number) => {
    //     const { p, rest } = filterPath(i)

    //     if ( p === undefined ) 
    //         throw new Error('TRYING TO REMOVE PATH ' + i + ' BUT DIDNT FIND IN ' + paths.length + ' ' + paths.toString())
        
    //     setPaths( rest )
    // }

    const onClick = (i: number) => (isChecked: boolean) => {
        // isChecked ? addPath(i) : delPath(i)
    }

    const fetchConditions = () => {
        const roadName = 'M3'
        const type = 'IRI';
        const zoom = 5;
        getConditions(roadName, type, zoom, (data: WayConditions[]) => {
            console.log(data);
            setWays( data.slice(0, 10) )
        } )
    }

    return (
        <GraphProvider>

        <div className="ml-wrapper">
            <div className="ml-map">
                <MapWrapper>
                    {/* { ways.map( ({way, zoom}, i: number) => {
                        console.log(ways, way, zoom);
                        
                        return <RCHotline 
                            key={`ml-path-${i}`}
                            properties={{...zoom.properties, palette: IRIPalette}}
                            path={way.geom}
                            conditions={zoom.conditions}
                        />
                    } ) }  */}
                </MapWrapper>
                <Panel measurements={measurements} onClick={onClick} fetchConditions={fetchConditions}/>
            </div>
            <div className="ml-graph">
                <Graph 
                    labelX="distance (m)" 
                    labelY="IRI"
                    palette={IRIPalette}
                    plots={ 
                        ways
                            .filter( ({zoom}) => zoom.conditions.length > 0 )
                            .map( ({zoom, road}, i: number) => {
                                const bounds: Bounds = {
                                    minX: 0, // Math.min(...zoom.conditions.map(c => c.way_dist)),
                                    maxX: 1, // Math.max(...zoom.conditions.map(c => c.way_dist)),
                                    minY: 0, // Math.min(...zoom.conditions.map(c => c.value)),
                                    maxY: 10,// Math.max(...zoom.conditions.map(c => c.value)),
                                }

                                console.log(
                                    Math.min(...zoom.conditions.map(c => c.way_dist)), 
                                    Math.max(...zoom.conditions.map(c => c.way_dist)),
                                    Math.min(...zoom.conditions.map(c => c.value)),
                                    Math.max(...zoom.conditions.map(c => c.value))
                                );
                                
                                const data: GraphData = zoom.conditions.map((p: ConditionPoint, i: number) => [p.way_dist, p.value, i])
                                const label = zoom.properties.name + Math.round(Math.random() * 10000)
                                console.log(data);
                                
                                return { data, bounds, label, i }
                            } ) 
                    }
                />
            </div>
        </div>

        </GraphProvider> 
    );
}

export default RoadConditions;