import {  MapConditions, WayConditions } from "../models/path"
import { get, post } from "./fetch"


export const getWays = ( road: string, type: string, zoom: number, setWays: (data: MapConditions[]) => void ) => {
    post( '/conditions/ways', { road, type, zoom }, setWays )
}

export const getConditions = ( wayId: string, type: string, setConditions: (data: WayConditions) => void ) => {
    post( '/conditions/way', { wayId, type }, setConditions )
}