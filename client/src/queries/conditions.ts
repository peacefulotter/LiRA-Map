import { get, post } from "./fetch"


export const getConditions = ( road: string, type: string, zoom: number, setConditions: (data: any) => void ) => {
    post( '/conditions/full', { road, type, zoom }, setConditions )
}