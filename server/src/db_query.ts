
import { RideMeta, RidePos } from './models'

const MEASUREMENT_TYPE = 'a69d9fe0-7896-49e2-9e8d-e36f0d54f286'
const TASKID1 = 1608
const TASKID2 = 4032


export const getinterpolatedRides = async (db: any): Promise<RideMeta[]> => {
    return await db.
        select( '*' )
        .from( { public: 'Trips' } )
        .where( {
            'TaskId': TASKID1
        } );
}


export const getRide = async ( db: any, tripId: string ): Promise<RidePos> =>
{
    const queryRes = await db
        .select( '*' )
        .from( { public: 'Measurements' } )
        .where( {
            'FK_Trip': tripId,
            'FK_MeasurementType': MEASUREMENT_TYPE
        } );

    queryRes.shift()
    return queryRes.map( (trackPos: any, i: number) => {
        return { 'lat': trackPos.lat, 'lng': trackPos.lon }
    } )
}


export const getRideInterpolation = async ( db: any, tripId: string ): Promise<RidePos> =>
{
    const queryRes = await db
        .select( '*' )
        .from( { public: 'Measurements' } )
        .where( {
            'FK_Trip': tripId
        } );

    queryRes.shift()
    return queryRes.map( (trackPos: any, i: number) => {
        return { 'lat': trackPos.lat, 'lng': trackPos.lon }
    } )
}



export const getRides = async (db: any): Promise<RideMeta[]> => {
    return await db.
        select( '*' )
        .from( { public: 'Trips' } )
        .orderBy( 'TripId' )
        .limit( 30 );
}

// SELECT * FROM public."Measurements"
// WHERE "FK_Trip" = 'c1cf94d1-4957-467b-a61e-0d4f25b2a5ce'

// 3c2c473c-9b2f-4a07-8521-7ce21683c446