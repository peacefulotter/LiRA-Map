import { LatLngExpression } from "Leaflet.MultiOptionsPolyline";
import { useEffect, useMemo, useState } from "react";
import { useMapEvents } from "react-leaflet";
import { defaultHotlineOptions } from "../../../assets/hotline/constants";

import { HotPolyline } from "../../../assets/hotline/core/HotPolyline";
import { HotlineOptions, ReactHotline } from "../../../assets/hotline/hotline";
import Hotline from "../../../assets/hotline/renderers/Hotline";

import { useGraph } from "../../../context/GraphContext";
import { useZoom } from "../../../context/ZoomContext";

import useDefaultOptions from "./useDefaultOptions";


/**
 * Must be called inside ZoomProvider, GraphProvider and 
 * from a child component of MapContainer
 * @param hotline 
 * @returns 
 */
function useHotline<T, U, V extends LatLngExpression, W extends Hotline<U>>( createHotline: ReactHotline<T, U, V, W>, data: T, options: HotlineOptions ) 
{
    const { dotHover, minY, maxY } = useGraph()

    const map = useMapEvents({})
    const { zoom } = useZoom()

    const [hotline, setHotline] = useState<W>()
    const [hotPolyline, setHotPolyline] = useState<HotPolyline<V, U>>()

    const opts = useDefaultOptions(options, defaultHotlineOptions, [minY, maxY, zoom])
    // const options = useMemo( () => {
    //     const p = palette || DEFAULT_PALETTE;
    //     const min = minY || 0
    //     const max = maxY || 1

    //     return {
    //         weight: Math.max(zoom > 8 ? zoom - 6 : zoom - 5, 2),
    //         outlineWidth: 0,
    //         palette: p,
    //         min: min,
    //         max: max, 
    //     }
    // }, [palette, minY, maxY, zoom] )
    
    useEffect( () => {
        if ( hotline === undefined ) return;
        hotline.setOptions(options)
    }, [opts] )


    useEffect( () => {
        if ( hotPolyline === undefined ) return;
        hotPolyline.setHover(dotHover)
    }, [dotHover])


    useEffect( () => {

        const [_hotPolyline, _hotline] = createHotline( data, options )
        
        _hotPolyline.addTo(map)

        setHotline(_hotline)
        setHotPolyline(_hotPolyline)

        return () => { 
            _hotPolyline.remove()
            map.removeLayer(_hotPolyline);
        }

    }, [map])

    return hotline
}


export default useHotline;