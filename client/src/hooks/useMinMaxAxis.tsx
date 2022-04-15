
import { useState } from "react"
import { AddMinMaxFunc, MinMaxAxis, RemMinMaxFunc } from "../models/graph";



type LabelMinMax = {[key: string]: MinMaxAxis}

const defaultMinX = 0;
const defaultMaxX = 10;
const defaultMinY = 0;
const defaultMaxY = 10;

const defaultMinMax: MinMaxAxis = [
    defaultMinX, defaultMaxX, 
    defaultMinY, defaultMaxY
]

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

    const addMinMax = (label: string, _minX: number, _maxX: number, _minY: number, _maxY: number) => {
        if ( firstUpdate )
        {
            setFirstUpdate(false)
            setMinMaxAxis( [ _minX, _maxX, _minY, _maxY ] )
        }
        else
        {
            setMinMaxAxis( prev => update(prev, [_minX, _maxX, _minY, _maxY]) )
        }

        const temp = {...labels}
        temp[label] = [_minX, _maxX, _minY, _maxY]
        setLabels(temp)
    }

    const remMinMax = (label: string) => {
        const temp = {...labels}
        delete temp[label]
        setLabels(temp)

        const _minMaxAxis = Object.values(temp).reduce( update, defaultMinMax )
        setMinMaxAxis(_minMaxAxis)
    }
    
    return [minMaxAxis, addMinMax, remMinMax]
}

export default useMinMaxAxis;