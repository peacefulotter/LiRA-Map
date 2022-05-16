import { get, post } from "./fetch"



export const getWayIds = (road: string): number[] => {
    return [
        5056416,
        358202922,
        358202917,
        273215212,
        117882081,
        24449371,
        5056434,
        205390176,
        205390170,
        2860952,
        23474957,
        729386233,
        35221934,
        35913117,
        878636806,
        878636808,
        26361334,
        38154645,
        38072846,
        527276167,
        527276166,
        30219634,
        25949335,
        25949338,
        205636596,
        9512945,
        85205854,
        219657886,
        263681425,
        263681427,
        219657881,
        263276626,
        271780210,
        25075330,
        5056369,
        5056367,
        5056375,
        5056380,
        5056381,
        5056366,
        219657806,
        219657811,
        23000641,
        98479074,
        98479020,
        23000640,
        29057944
    ]
}

export const getConditions = ( roadName: string, type: string, zoom: number, setConditions: (data: any) => void ) => {
    const wayIds = getWayIds(roadName)
    console.log(wayIds);
    post( '/conditions/full', { wayIds, type, zoom }, setConditions )
}