import { FC, ReactElement, useEffect, useState } from "react";

import {  RideData } from '../../assets/models'
import { Measurement } from './Measurements'
import Renderers from "../../assets/renderers";


type Props = {
	path: RideData;
    properties: Measurement;
    map: any;
};


// FIXME: remove the useEffect and the useState
const Path: FC<Props> = ( { properties, path, map } ) => {

    const [p, setP] = useState<ReactElement | ReactElement[]>([]);

    useEffect( () => {
        const renderer = Renderers[properties.rendererIndex] 
        const elements: any = renderer.func(path, properties, map)

        // use elements.remove to distinguish ReactElement(s) and leaflet object(s)        
        if ( !elements.remove )
            setP(elements);

        return () => {
            if ( elements.remove )
                elements.remove(map)
        }

    }, [path, properties])  

    return ( <> { p } </> )
}

export default Path;
