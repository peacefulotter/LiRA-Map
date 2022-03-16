
import { FC, useState } from "react";


import { EventPathProps, EventRenderer } from '../../assets/models'
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

const EventPath: FC<EventPathProps> = ( { tripName, path, properties, metadata } ) => {

    const [selected, setSelected] = useState<number | undefined>(undefined);

    const md = metadata || {}
    const EventRenderer = renderers[properties.renderer] as EventRenderer

    return ( <> 
        <EventRenderer 
            path={path} 
            properties={properties} 
            onClick={(i: number) => {return {click: () => setSelected(i)}}} 
        />
        { selected && 
            <Marker position={path.data[selected].pos}>
                <Popup>
                    { tripName && getPopupLine('Trip', tripName) }
                    { path.data[selected].value && getPopupLine('Value', path.data[selected].value as number) }
                    { Object.keys(md).map(key =>  getPopupLine(key, parseMD(md[key]))) }
                </Popup>
            </Marker> 
        }
    </> )
}

export default EventPath;
