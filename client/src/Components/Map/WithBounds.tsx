import { FC, useEffect, useState } from "react";

import useMapBounds from "./Hooks/useMapBounds";

import { MapBounds } from "../../models/map";

interface IMapBounds {
    onChange: (bounds: MapBounds) => void;
    padding: number;
}

const WithBounds: FC<IMapBounds> = ( props ) => {

    const { onChange, padding, children } = props;
    
    const bounds = useMapBounds();
    const [loadedBounds, setLoadedBounds] = useState<MapBounds>(bounds)

    const load = () => {
        const { minLat, maxLat, minLng, maxLng } = bounds;
        const boundsToLoad = { 
            minLat: minLat - padding, 
            maxLat: maxLat + padding, 
            minLng: minLng - padding, 
            maxLng: maxLng + padding 
        }
        onChange( boundsToLoad )
        // promise?
        setLoadedBounds( boundsToLoad )
    }

    useEffect( load, [] )
    
    useEffect( () => {
        const inLoadedBounds = 
            bounds.minLat >= loadedBounds.minLat &&
            bounds.maxLat <= loadedBounds.maxLat &&
            bounds.minLng >= loadedBounds.minLng &&
            bounds.maxLng <= loadedBounds.maxLng

        if ( inLoadedBounds ) return;

        load()

    }, [bounds] )

    return (
        <> {children} </>
    )
}

export default WithBounds;