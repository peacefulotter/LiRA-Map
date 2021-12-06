import { FC, ReactElement, useEffect, useState } from "react";

import {  RideData } from '../../assets/models'
import { Measurements, Measurement } from '../../assets/measurements'
import Renderers from "../../assets/renderers";


type Props = {
	path: RideData;
    measIndex: number;
    zoom: number;
    map: any;
};


const getWeight = (n: number): number => { return n < 17 ? (n <= 15 ? 3 : 2) : 1 }


// FIXME: remove the useEffect and the useState
const Path: FC<Props> = ( { path, measIndex, zoom, map } ) => {

    const [p, setP] = useState<ReactElement | ReactElement[]>([]);

    useEffect( () => {
        if ( measIndex === undefined ) return;

        const properties: Measurement = Measurements[measIndex]; 
        const weight = getWeight(zoom) 
        const renderer = Renderers[properties.rendererIndex] 
        const elements: any = renderer.func(path, weight, properties, map)

        // use elements.remove to distinguish ReactElement(s) and leaflet object(s)        
        if ( !elements.remove )
            setP(elements);

        return () => {
            if ( elements.remove )
                elements.remove(map)
        }

    }, [path, measIndex])  

    return ( <> { p } </> )
}

export default Path;
