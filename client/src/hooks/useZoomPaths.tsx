import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useZoom } from "../context/ZoomContext";
import { JSONProps, PointData } from "../models/path"

type ZoomJson = { [key: number]: JSONProps[] }

const useZoomPaths = (): [JSONProps[], Dispatch<SetStateAction<JSONProps[]>>] => {

    const [paths, setPaths] = useState<JSONProps[]>([]);
    const { zoom } = useZoom()

    useEffect( () => {
        console.log('changing zoom', zoom);
        
        // setPaths( (ps: JSONProps[]) => 
        //     ps.map( (p: JSONProps) => {
        //         const { metadata, properties, dataPath } = p
        //         const { path, minX, minY, maxX, maxY } = dataPath
        //         return { 
        //             metadata, properties, 
        //             dataPath: {
        //                 minX, minY, maxX, maxY,
        //                 path: path.filter( (point: PointData) => point.metadata.zoom + 15 === zoom ) 
        //             }
        //         }
        //     } )
        // )
    }, [zoom])

    const addPath = (s: string, zoom: number) => {

    }

    return [paths, setPaths]
}

export default useZoomPaths