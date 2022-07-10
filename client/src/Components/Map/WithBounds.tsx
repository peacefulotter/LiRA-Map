import { FC, useEffect, useState } from "react";
import { Rectangle } from "react-leaflet";
import { LatLngBounds } from "leaflet";

import useMapBounds from "./Hooks/useMapBounds";

interface IMapBounds {
    onChange: (bounds: LatLngBounds) => Promise<void>;
    padding?: number;
}

const WithBounds: FC<IMapBounds> = ( props ) => {

    const { onChange, padding, children } = props;

    const bounds = useMapBounds();
    const [loadedBounds, setLoadedBounds] = useState<LatLngBounds>()

    const load = () => {
        if ( bounds === undefined ) return;

        const boundsToLoad = bounds.pad(padding || 1)

        onChange( boundsToLoad ).then( () => {
            setLoadedBounds( boundsToLoad ) 
        } )
    }

    useEffect( load, [] )
    
    useEffect( () => {
        if ( 
            bounds === undefined || 
            loadedBounds === undefined || 
            loadedBounds.contains( bounds ) 
        ) 
            return

        load()

    }, [bounds] )

    return (
        <> 
        {/* { bounds && <Rectangle bounds={bounds} /> } */}
        { loadedBounds && <Rectangle bounds={loadedBounds} color='red' /> }
        {children} 
        </>
    )
}

export default WithBounds;