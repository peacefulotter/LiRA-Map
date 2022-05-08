import React, { useEffect, useState } from "react";

import MetadataPath from "../Components/Map/MetadataPath";
import MapWrapper from "../Components/Map/MapWrapper";
import Graph from "../Components/Graph/Graph";
import Checkbox from "../Components/Checkbox";

import { JSONProps, PointData } from "../models/path";
import { Measurement } from "../models/properties";
import { GraphData, Palette } from "../models/graph";

import { get, post } from "../queries/fetch";

import { GraphProvider } from "../context/GraphContext";
import useZoomPaths from "../hooks/useZoomPaths";

import { DEFAULT_PALETTE } from "../assets/properties";

import "../css/ml.css";

// const IRIPalette: Palette = [
//     {offset: 0,   color: "green",  stopValue: 0  },
//     {offset: 0.5, color: "yellow", stopValue: 5  },
//     {offset: 1,   color: "red",    stopValue: 10 }
// ]

const IRIPalette: Palette = DEFAULT_PALETTE


const ML = () => {

    const [paths, setPaths] = useZoomPaths()
    const [measurements, setMeasurements] = useState<Measurement[]>([])

    console.log("ML reset");

    useEffect( () => {
        get('/ml_files', setMeasurements)
    }, [] )

    const addPath = (i: number) => {
        post('/ml_file', { filename: measurements[i].name }, (json: JSONProps) => {
            setPaths( prev => [...prev, json] )
        } )
    }

    const filterPath = (i: number): [JSONProps | undefined, JSONProps[]] => {
        const n = measurements[i].name
        return [ 
            paths.find(   (pp: JSONProps) => pp.properties.name === n ), 
            paths.filter( (pp: JSONProps) => pp.properties.name !== n ) 
        ]
    }

    const delPath = (i: number) => {
        const [p, newPaths] = filterPath(i)
        if (p === undefined) 
            return console.log('ERROR, TRYING TO REMOVE PATH', i, 'BUT DIDNT FIND', paths);
        
        setPaths( newPaths )
    }

    const onClick = (i: number) => (isChecked: boolean) => {
        isChecked ? addPath(i) : delPath(i)
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

export default React.memo(ML);