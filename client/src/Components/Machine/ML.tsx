import { FC, useEffect, useState } from "react";
import { PathProps } from "../../assets/models";

import MapWrapper from "../Map";
import Checkbox from "../Checkbox";

import "../../css/ml.css";
import Path from "../Renderers/Path";

const brokerURL = "ws://localhost:3001/ws"


const range = (n: number): boolean[] => { 
    return Array.from( {length: n}, (elt, i) => true);
}

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
            console.log(payload);
            const { type, filename, data } = JSON.parse(payload.data);
            console.log('received:', type, filename, data);
            
            if ( type === 'rename' || type === 'change' )
            {
                const pathProps = JSON.parse(data)
                const temp = { ...paths, [filename]: pathProps }
                setPaths(temp);
            }
            else if ( type === 'CONNECTED' )
            {
                const temp: any = {}
                for ( const file of data )
                {
                    temp[file.filename] = file.data;
                }
                setPaths(temp);
                setSelectedPaths(range(data.length))
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
                { Object.values(paths).filter((elt, i) => selectedPaths[i]) }
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