import { Condition, WaysConditions } from "../models/path"
import { get, post } from "./fetch"


export const getWaysConditions = ( type: string, zoom: number, setWays: (data: WaysConditions) => void ) => {
    post( '/conditions/ways', { type, zoom }, setWays )
}

export const getConditions = ( wayId: string, type: string, setConditions: (data: Condition[]) => void ) => {
    post( '/conditions/way', { wayId, type }, setConditions )
}