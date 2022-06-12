
import {  MapConditions } from "../models/path"
import { get } from "./fetch"

export const getAltitudes = ( setAltitudes: (data: MapConditions) => void ) => {
    get( '/altitude', setAltitudes )
}