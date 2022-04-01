import { RideMeta } from "../models/models"
import { get } from "./fetch"


export const getRides = ( callback: React.Dispatch<React.SetStateAction<RideMeta[]>> ) => {
    get( '/rides', (data: any) => {
        callback(data.filter((d: RideMeta) => d.TaskId !== 0 )) 
    } )
}