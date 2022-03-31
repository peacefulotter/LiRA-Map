import { FC, useEffect, useState } from "react";

import MapWrapper from "../Map/MapWrapper";
import EventPath from "../Map/EventPath";
import Checkbox from "../Checkbox";

import { PathProps } from "../../assets/models";

import "../../css/ml.css";

const brokerURL = "ws://localhost:3001/ws"

type PathsMap = {[key: string]: PathProps}

const range = (n: number): boolean[] => { 
    return Array.from( {length: n}, (elt, i) => true);
}

const ML: FC = () => {
    const [paths, setPaths] = useState<PathsMap>({});
    const [selectedPaths, setSelectedPaths] = useState<boolean[]>([])

    useEffect(() => {
        const ws = new WebSocket(brokerURL);

        ws.onopen =  () => {
            console.log('open');
            ws.send('something');
        };

        ws.onmessage = payload => {
            const { type, filename, data } = JSON.parse(payload.data);
            console.log('received:', type, filename, data);
            
            if ( type === 'rename' || type === 'change' )
            {
                console.log(typeof data);
                
                // const pathProps = typeof data === 'string' ? JSON.parse(data) : data
                const tripName = filename.replace('.json', '')
                
                const temp = { ...paths, [tripName]: data }
                console.log(paths);
                
                console.log(temp)
                setPaths(temp);
            }
            else if ( type === 'deleted' )
            {
                const temp = { ...paths }
                const tripName = filename.replace('.json', '')
                delete temp[tripName];
                setPaths(temp)
            }
            else if ( type === 'CONNECTED' )
            {
                setSelectedPaths(range(data.length))

                const temp: any = {}
                for ( const file of data )
                {
                    const tripName = file.filename.replace('.json', '')
                    temp[tripName] = file.data;
                }
                setPaths(temp);
                console.log(temp);
            }
        };
    }, [])

    const onClick = (i: number) => () => {
        const temp = [...selectedPaths]
        temp[i] = !temp[i]
        setSelectedPaths(temp)
    }

    return (
        <div className="ml-wrapper">
            <MapWrapper>
                { Object.keys(paths)
                    .map( (k, i) => selectedPaths[i] 
                        ? <EventPath 
                            key={`ml-path-${i}`}
                            dataPath={paths[k].dataPath}
                            properties={paths[k].properties}
                            metadata={paths[k].metadata} /> 
                        : <></>) 
                }
            </MapWrapper>
            <div className="ml-checkboxes">
                { Object.keys(paths).map( (filename, i) => 
                    <Checkbox 
                        key={`ml-${i}`} 
                        forceState={selectedPaths[i]}
                        className="btn ml-checkbox" 
                        html={<div>{filename}</div>} 
                        onClick={onClick(i)}/>
                ) }
            </div>
        </div>
    );
}

export default ML;