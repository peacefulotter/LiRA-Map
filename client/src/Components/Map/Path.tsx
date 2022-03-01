import { FC, ReactElement, useEffect, useState } from "react";


import Renderers from "./renderers";
import { PathProps } from '../../assets/models'
import { Marker, Popup, useMap } from "react-leaflet";


const parseMD = (md: any) => {
    if ( typeof md === 'object' )
    {
        const res = []
        for ( const smth of md )
            res.push( <><div>{parseMD(smth)}</div></> )
        return res
    }
    
    return md
}

// FIXME: remove the useEffect and the useState
const Path: FC<PathProps> = ( { properties, path, metadata } ) => {

    const [p, setP] = useState<ReactElement | ReactElement[]>([]);
    const [marker, setMarker] = useState<[number, number]>([0, 0]); // marker showing metadata
    
    const map = useMap()

    const md = metadata || {}

    useEffect( () => {        
        const renderer = Renderers[properties.rendererIndex] 
        const elements: any = renderer.func(path, properties, setMarker, map)

        // use elements.remove to distinguish ReactElement(s) and leaflet object(s)        
        if ( !elements.remove )
            setP(elements);

        return () => {
            if ( elements.remove )
                elements.remove(map)
        }

    }, [properties, path])  

    return ( <> 
        { p }
        <Marker position={marker}>
            <Popup>
                { Object.keys(md).map(key => <><div>{key}: {parseMD(md[key])}</div><br/></> ) }
            </Popup>
        </Marker> 
    </> )
}

export default Path;
