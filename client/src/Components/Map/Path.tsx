import { FC, useState } from "react";


import { PathProps, PointData } from '../../assets/models'
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

const getPopupLine = (key: string, value: string | number) => {
    return <><div>{key}: {value}</div><br/></>
}

const Path: FC<PathProps> = ( { path, properties, metadata } ) => {

    const [selected, setSelected] = useState<number>(-1);

    const md = metadata || {}
    const Renderer = renderers[properties.renderer]
    console.log(Renderer)

    if ( path.data.length === 0 || Renderer === undefined ) 
         return <></>

    const clickedPoint: PointData = selected === -1 
        ? ({ pos: { lat: 0, lng: 0 } } as PointData)
        : path.data[selected]

    return ( <> 
        <Renderer path={path} properties={properties} setSelected={setSelected} />
        <Marker position={clickedPoint.pos}>
            <Popup>
                { clickedPoint.value === undefined ? <></> : getPopupLine('Value', clickedPoint.value) }
                { Object.keys(md).map(key =>  getPopupLine(key, parseMD(md[key]))) }
            </Popup>
        </Marker> 
    </> )
}

export default Path;
