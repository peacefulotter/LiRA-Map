
import { FC, useState } from "react";


import { EventRenderer, PathProps } from '../../assets/models'
import { Marker, Popup } from "react-leaflet";
import renderers from "../../assets/renderers";


const parseMD = (mds: any) => {
    console.log(mds, typeof mds === 'object');
    
    if ( typeof mds === 'object' && Array.isArray(mds) )
    {
        return <div key={`md-${Math.random()}`}>{mds.map(md => parseMD(md)).join(', ')}</div>
    }
    else if ( typeof mds === 'object' )
    {
        return Object.keys(mds).map(k => 
            <div key={`md-${Math.random()}`}> {' > '} {k}: {parseMD(mds[k])}</div>
        )
    }

    return mds
}

const getPopupLine = (key: string, value: any) => {
    if ( value === undefined || value === null )
        return <></>

    else if ( typeof value === 'object' )
        return <div key={`popupline-${Math.random()}`}>{key}:{parseMD(value)}</div>
    
    return <div key={`popupline-${Math.random()}`}>{key}: {value}</div>
}

const EventPath: FC<PathProps> = ( { path, properties, metadata } ) => {

    const [markerPos, setMarkerPos] = useState<[number, number]>([0, 0]);
    const [selected, setSelected] = useState<number | undefined>(undefined);

    const md = metadata || {}
    const EventRenderer = renderers[properties.renderer] as EventRenderer

    const onClick = (i: number) => (e: any) => {
        const { lat, lng } = e.latlng
        setMarkerPos([lat, lng])
        setSelected(i)
    }
    
    const point = path.data[selected || 0]
    
    return ( <> 
        <EventRenderer 
            path={path} 
            properties={properties} 
            onClick={onClick} 
        />
        { selected !== undefined && 
            <Marker position={markerPos}>
                <Popup>
                    { getPopupLine('Properties', properties) }
                    { getPopupLine('Value', point.value) }
                    { getPopupLine('Timestamp', point.timestamp) }
                    { Object.keys(point.metadata || {}).map(key => getPopupLine(key, point.metadata[key]))}
                    { Object.keys(md).map(key => getPopupLine(key, md[key]))}
                </Popup>
            </Marker> 
        }
    </> )
}

export default EventPath;