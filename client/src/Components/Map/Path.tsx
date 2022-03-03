import { FC, useState } from "react";


import { PathProps } from '../../assets/models'
import { Marker, Popup } from "react-leaflet";
import renderers from "../../assets/renderers";


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


const Path: FC<PathProps> = ( { path, properties, metadata } ) => {

    const [marker, setMarker] = useState<[number, number]>([0, 0]); // marker showing metadata

    const md = metadata || {}
    const Renderer = renderers[properties.renderer]
    console.log(Renderer)

    if ( path.data.length === 0 || Renderer === undefined ) 
         return <></>

    return ( <> 
        <Renderer path={path} properties={properties} setMarker={setMarker} />
        <Marker position={marker}>
            <Popup>
                { Object.keys(md).map(key => <><div>{key}: {parseMD(md[key])}</div><br/></> ) }
            </Popup>
        </Marker> 
    </> )
}

export default Path;
