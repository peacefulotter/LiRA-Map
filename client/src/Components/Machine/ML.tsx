import { FC, useEffect, useState } from "react";
import { PathProps } from "../../assets/models";

import MapWrapper from "../Map/MapWrapper";
import Checkbox from "../Checkbox";

import "../../css/ml.css";
import Path from "../Map/Path";

const brokerURL = "ws://localhost:3001/ws"

type PathsMap = {[key: string]: PathProps}

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
                const temp = { ...paths, [filename]: data }
                console.log(paths);
                
                console.log(temp)
                setPaths(temp);
            }
            else if ( type === 'deleted' )
            {
                const temp = { ...paths }
                delete temp[filename];
                setPaths(temp)
            }
            else if ( type === 'CONNECTED' )
            {
                const temp: any = {}
                for ( const file of data )
                {
                    temp[file.filename] = file.data;
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
                { Object.values(paths)
                    .filter((elt, i) => selectedPaths[i])
                    .map( p => <Path key={`MLPath${Math.random()}`} path={p.path} properties={p.properties} />) 
                }
            </MapWrapper>
            <div className="ml-checkboxes">
                { Object.keys(paths).map( (filename, i) => 
                    <Checkbox 
                        key={`ml-${Math.random()}`} 
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