import { FC, useEffect, useState } from "react";
import { PathProps } from "../../assets/models";
import { Client } from '@stomp/stompjs';

import MapWrapper from "../Map";

import "../../css/ml.css";
import Checkbox from "../Checkbox";

const brokerURL = "ws://localhost:3001/ws"


type PathsMap = {[key: string]: PathProps}

const ML: FC = () => {
    const [paths, setPaths] = useState<PathsMap>({});
    const [selectedPaths, setSelectedPaths] = useState<number[]>([])

    useEffect(() => {
        const ws = new WebSocket(brokerURL);

        ws.onopen =  () => {
            console.log('open');
            ws.send('something');
        };

        ws.onmessage = payload => {
            const notif = JSON.parse(payload.data);
            console.log('received:', notif);
            
            if ( notif.type === 'filechange' )
            {
                const temp = {...paths}
                temp[notif.filename] = notif.data
                setPaths(temp);
            }
        };
    }, [])

    const onClick = (i: number) => () => {
        console.log(i);
        
        // add or remove
        // setSelectedPaths(  )
    }

    return (
        <div className="ml-wrapper">
            {/* <MapWrapper paths={Object.values(paths)} /> */}
            { Object.keys(paths).map( (filename, i) => 
                <Checkbox className="filename-checkbox" html={<div>{filename}</div>} onClick={onClick(i)}/>
            ) }
        </div>
    );
}

export default ML;