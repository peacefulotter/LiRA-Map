
import { useCallback, useState } from "react"
import { AddMinMaxFunc, MinMaxAxis, RemMinMaxFunc } from "../models/graph";
import { Bounds } from "../models/path";



type LabelMinMax = {[key: string]: MinMaxAxis}

const defaultMinX = 0;
const defaultMaxX = 10;
const defaultMinY = 0;
const defaultMaxY = 10;

const defaultMinMax: MinMaxAxis = [
    defaultMinX, defaultMaxX, 
    defaultMinY, defaultMaxY
]

const min = (_min?: number) => _min || Number.MAX_SAFE_INTEGER
const max = (_max?: number) => _max || Number.MIN_SAFE_INTEGER

const useMinMaxAxis = (): [MinMaxAxis, AddMinMaxFunc, RemMinMaxFunc] => {

    const [firstUpdate, setFirstUpdate] = useState<boolean>(true)
    const [labels, setLabels] = useState<LabelMinMax>({})
    const [minMaxAxis, setMinMaxAxis] = useState<MinMaxAxis>(defaultMinMax)

    const update = (prev: MinMaxAxis, cur: MinMaxAxis): MinMaxAxis => {
        return [
            Math.min(prev[0], cur[0]),
            Math.max(prev[1], cur[1]),
            Math.min(prev[2], cur[2]),
            Math.max(prev[3], cur[3])
        ]
    }

    const addMinMax = useCallback( (label: string, bounds: Bounds) => {

        const { minX, maxX, minY, maxY } = bounds;
        
        const newMinMax: MinMaxAxis = [
            min(minX), max(maxX), min(minY), max(maxY) 
        ]
        
        if ( firstUpdate )
        {
            setFirstUpdate(false)
            setMinMaxAxis( newMinMax )
        }
        else
        {
            setMinMaxAxis( prev => update(prev, newMinMax) )
        }

        setLabels( prev => { return { ...prev, newMinMax } } )

    }, [setLabels, setMinMaxAxis, firstUpdate, setFirstUpdate] )


    const remMinMax = useCallback( (label: string) => {
        
        const temp = {...labels}
        delete temp[label]
        
        setLabels( temp )

        const _minMaxAxis = Object.values(temp).reduce( update, defaultMinMax )
        setMinMaxAxis(_minMaxAxis)

    }, [setLabels, setMinMaxAxis] )

    
    return [minMaxAxis, addMinMax, remMinMax]
}

export default useMinMaxAxis;