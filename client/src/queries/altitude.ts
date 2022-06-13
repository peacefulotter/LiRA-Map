
import {  MapConditions, ValueLatLng } from "../models/path"
import { get } from "./fetch"

export const getAltitudes = ( setAltitudes: (data: MapConditions) => void ) => {
    get( '/altitude', setAltitudes )
}

export const getHeat = ( setHeat: (data: ValueLatLng[]) => void ) => {
    get( '/altitude/heat', setHeat )
}