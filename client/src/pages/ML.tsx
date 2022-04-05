import { FC, useEffect, useState } from "react";

import MapWrapper from "../Components/Map/MapWrapper";
import MetadataPath from "../Components/Map/MetadataPath";
import Checkbox from "../Components/Checkbox";

import { JSONProps } from "../models/path";
import { get, post } from "../queries/fetch";
import { Measurement } from "../models/properties";

import "../css/ml.css";

const range = (n: number): boolean[] => { 
    return Array.from( {length: n}, (elt, i) => true);
}

const ML: FC = () => {
    const [paths, setPaths] = useState<JSONProps[]>([]);
    const [measurements, setMeasurements] = useState<Measurement[]>([])

    console.log(measurements);
    

    useEffect(() => {
        get('/ml_files', setMeasurements)
    }, [])

    const addPath = (i: number) => {
        post('/ml_file', { filename: measurements[i].name }, (json: JSONProps) =>
            setPaths( prev => [...prev, json] ) 
        )
    }

    const delPath = (i: number) => {
        setPaths( prev => prev
            .filter( (pp: JSONProps) => pp.properties.name !== measurements[i].name )
        )
    }

    const onClick = (i: number) => (isChecked: boolean) => {
        isChecked ? addPath(i) : delPath(i)
    }

    return (
        <div className="ml-wrapper">
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
    );
}

export default ML;