import React, { useEffect, useState } from "react";

import MetadataPath from "../Components/Map/MetadataPath";
import MapWrapper from "../Components/Map/MapWrapper";
import Graph from "../Components/Graph/Graph";
import Panel from "../Components/RoadCondition/Panel";

import { JSONProps, PointData } from "../models/path";
import { GraphData, Palette } from "../models/graph";

import { get, post } from "../queries/fetch";

import { GraphProvider } from "../context/GraphContext";

import { DEFAULT_PALETTE } from "../assets/properties";

import "../css/road_conditions.css";
import { getConditions } from "../queries/postgis";


const IRIPalette: Palette = DEFAULT_PALETTE

interface FilterJSON { 
    p: JSONProps | undefined,
    rest: JSONProps[]
}


const RoadConditions = () => {

    const [paths, setPaths] = useState<JSONProps[]>([])
    const [measurements, setMeasurements] = useState<string[]>([])

    useEffect( () => {
        get('/conditions/files', setMeasurements)
    }, [] )

    const addPath = (i: number) => {
        post('/conditions/file', { filename: measurements[i] }, (json: JSONProps) => {
            setPaths( prev => [...prev, json] )
        } )
    }
    
    const filterPath = (i: number): FilterJSON => {
        const n = measurements[i]
        return paths.reduce( (acc: FilterJSON, cur: JSONProps) => cur.properties.name === n 
            ? { p: cur, rest: acc.rest } 
            : { p: acc.p, rest: [...acc.rest, cur] } 
        , { p: undefined, rest: [] }  )
    }

    const delPath = (i: number) => {
        const { p, rest } = filterPath(i)
        
        if ( p === undefined ) 
            throw new Error('TRYING TO REMOVE PATH' +  i + 'BUT DIDNT FIND IN' + paths)
        
        setPaths( rest )
    }

    const onClick = (i: number) => (isChecked: boolean) => {
        isChecked ? addPath(i) : delPath(i)
    }

    const fetchConditions = () => {
        getConditions('road', 0, (data: any) => {
            console.log(data);
            // setPaths( prev => [...prev, data] )
        } )
    }

    return (
        <GraphProvider>

        <div className="ml-wrapper">
            <div className="ml-map">
                <MapWrapper>
                    { paths.map( (props: JSONProps, i: number) => 
                        <MetadataPath 
                            key={`ml-path-${i}`}
                            properties={{...props.properties, palette: IRIPalette}}
                            path={props.path}
                            metadata={props.metadata}
                        />
                    ) } 
                </MapWrapper>
                <Panel measurements={measurements} onClick={onClick} fetchConditions={fetchConditions}/>
            </div>
            <div className="ml-graph">
                <Graph 
                    labelX="distance (m)" 
                    labelY="IRI"
                    palette={IRIPalette}
                    plots={ 
                        paths.map( (json: JSONProps, i: number) => {
                            const { path, bounds } = json;
                            const data: GraphData = path.map((p: PointData, i: number) => [p.metadata.tdist, p.value || 0, i])
                            const label = json.properties.name
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