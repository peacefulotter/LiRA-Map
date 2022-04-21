import React, { FC, useEffect, useState } from "react";

import MetadataPath from "../Components/Map/MetadataPath";
import MapWrapper from "../Components/Map/MapWrapper";
import Graph from "../Components/Graph/Graph";
import Checkbox from "../Components/Checkbox";

import { JSONProps, PointData } from "../models/path";
import { Measurement } from "../models/properties";
import { GraphData } from "../models/graph";

import { get, post } from "../queries/fetch";

import "../css/ml.css";
import { GraphProvider } from "../context/GraphContext";


const ML: FC = () => {

    const [paths, setPaths] = useState<JSONProps[]>([]);
    const [measurements, setMeasurements] = useState<Measurement[]>([])

    console.log("ML reset");

    useEffect( () => {
        get('/ml_files', setMeasurements)
    }, [] )

    const addPath = (i: number) => {
        post('/ml_file', { filename: measurements[i].name }, (json: JSONProps) => {
            setPaths( prev => [...prev, json] )

            let curDist = 0;
            let curWay = json.dataPath.path[0].metadata.way_id 

            // addGraph(json, (p: PointData) => {
            //     const { dist, way_id } = p.metadata

            //     if (way_id !== curWay) {
            //         curDist++
            //         curWay = way_id
            //     }

            //     return dist + curDist
            // })
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
        // remGraph(p)
    }

    const onClick = (i: number) => (isChecked: boolean) => {
        isChecked ? addPath(i) : delPath(i)
    }

    return (
        <GraphProvider>
        <div className="ml-wrapper">
            <div className="ml-map">
                <MapWrapper>
                    { paths.map( (prop: JSONProps, i: number) => 
                        <MetadataPath 
                            key={`ml-path-${i}`}
                            {...prop}
                        />
                    ) } 
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
                <Graph 
                    labelX="distance (m)" 
                    labelY="IRI"
                    plots={ 
                        paths.map( (json: JSONProps, i: number) => {
                            const { path, minX, maxX, minY, maxY } = json.dataPath;
                            const data: GraphData = path.map((p: PointData, i: number) => [p.metadata.tdist, p.value || 0, i])
                            const label = json.properties.name
                            return { data, minX, maxX, minY, maxY, label, i }
                        } ) 
                    }
                />
            </div>
        </div>
        </GraphProvider> 
    );
}

export default React.memo(ML);