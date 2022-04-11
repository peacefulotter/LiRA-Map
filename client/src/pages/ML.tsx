import React, { FC, useEffect, useState } from "react";

import MetadataPath from "../Components/Map/MetadataPath";
import MapWrapper from "../Components/Map/MapWrapper";
import Graph from "../Components/Machine/Graph";
import Checkbox from "../Components/Checkbox";

import { JSONProps, PointData } from "../models/path";
import { Measurement } from "../models/properties";

import { useGraph } from "../context/GraphContext";

import { get, post } from "../queries/fetch";

import "../css/ml.css";
import { RendererName } from "../models/renderers";

const ML: FC = () => {

    const [paths, setPaths] = useState<JSONProps[]>([]);
    const [measurements, setMeasurements] = useState<Measurement[]>([])

    const { addGraph, remGraph } = useGraph()

    console.log("ML reset");

    useEffect( () => {
        get('/ml_files', setMeasurements)
    }, [] )

    const addPath = (i: number) => {
        post('/ml_file', { filename: measurements[i].name }, (json: JSONProps) => {
            // setPaths( prev => [...prev, json] )

            let curDist = 0;
            let curWay = json.dataPath.path[0].metadata.way_id 

            addGraph(json, (p: PointData) => {
                const { dist, way_id } = p.metadata
                
                if (way_id !== curWay) {
                    curDist++
                    curWay = way_id
                }

                return dist + curDist
            })
        } )
    }


    const filterPath = (i: number): [JSONProps | undefined, JSONProps[]] => {
        const findPred = (pp: JSONProps) => pp.properties.name === measurements[i].name
        const filterPred = (pp: JSONProps) => pp.properties.name !== measurements[i].name
        return [ paths.find( findPred ), paths.filter( filterPred ) ]
    }

    const delPath = (i: number) => {
        const [p, newPaths] = filterPath(i)
        if (p === undefined) 
            return console.log('ERROR, TRYING TO REMOVE PATH', i, 'BUT DIDNT FIND', paths);
        
        setPaths( newPaths )
        remGraph(p)
    }

    const onClick = (i: number) => (isChecked: boolean) => {
        isChecked ? addPath(i) : delPath(i)
    }

    return (
        <div className="ml-wrapper">
            <div className="ml-map">
                <MapWrapper>
                    {/* { paths.map( (prop: JSONProps, i: number) => 
                        <MetadataPath 
                            key={`ml-path-${i}`}
                            {...prop}
                        />
                    ) } */}
                </MapWrapper>
                <div className="ml-checkboxes">
                    { measurements.map( (meas, i) => 
                        <Checkbox 
                            key={`ml-meas-cb-${i}`} 
                            className="btn ml-checkbox" 
                            html={<div>{meas.name}</div>} 
                            onClick={onClick(i)}/>
                    ) }
                </div>
            </div>
            <div className="ml-graph">
                <Graph labelX="distance (m)" labelY="IRI" />
            </div>
        </div>
    );
}

export default React.memo(ML);