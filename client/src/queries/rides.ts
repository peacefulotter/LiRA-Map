import { RideMeta } from "../models/models"
import { get } from "./fetch"


export const getRides = ( callback: React.Dispatch<React.SetStateAction<RideMeta[]>> ) => {
    get( '/rides', callback )
}