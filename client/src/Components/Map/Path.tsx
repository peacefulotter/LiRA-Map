import { FC, ReactElement, useEffect, useState } from "react";


import Renderers from "./renderers";
import { PathProps } from '../../assets/models'
import { useMap } from "react-leaflet";


// FIXME: remove the useEffect and the useState
const Path: FC<PathProps> = ( { properties, path } ) => {

    const [p, setP] = useState<ReactElement | ReactElement[]>([]);

    const map = useMap()

    console.log(properties);
    

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

    }, [properties, path])  

    return ( <> { p } </> )
}

export default Path;
