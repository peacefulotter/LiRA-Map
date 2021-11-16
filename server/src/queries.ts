
import { RideMeta, RidePos } from './models'
import { Knex } from 'knex'

import { Position3D } from './models'

const TRACK_POS = 'a69d9fe0-7896-49e2-9e8d-e36f0d54f286'
const ACC_XYZ = '666607b6-0baa-4eb7-b395-21d3ea654159'

const TASKID1 = 1608
const TASKID2 = 4032

// TODO: get only the two column having the lat and lng attributes
const fetchPositions = async ( db: Knex<any, unknown[]>, query: object ): Promise<RidePos> =>
{
    const queryRes = await db
        .select( '*' )
        .from( { public: 'Measurements' } )
        .where( query );

    queryRes.shift()
    return queryRes.map( (trackPos: any, i: number) => {
        return { 'lat': trackPos.lat, 'lng': trackPos.lon }
    } )
}


export const getTrackPositions = async ( db: Knex<any, unknown[]>, tripId: string ): Promise<RidePos> =>
{
    return await fetchPositions( db, {
        'FK_Trip': tripId,
        'FK_MeasurementType': TRACK_POS // NOT WORKING ANYMORE
    } )
}

export const getInterpolatedData = async ( db: Knex<any, unknown[]>, tripId: string ): Promise<RidePos> =>
{
    return await fetchPositions(db, {
        'FK_Trip': tripId,
    } );
}

export const getAccelerationData = async ( db: Knex<any, unknown[]>, tripId: string ): Promise<Position3D[]> =>
{
    const res = await db
        .select( '*' )
        .from( { public: 'Measurements' } )
        .where( { 'FK_Trip': tripId } );

    console.log(res);

    return res
        .map( (data: any) => JSON.parse(data.message) )
        .filter( (data: any) => data['@t'] === 'acc.xyz' )
        .map( (data: any) => { return { x: data['acc.xyz.x'], y: data['acc.xyz.y'], z: data['acc.xyz.z'] } } )
}

export const getTest = async ( db: Knex<any, unknown[]> ): Promise<any> =>
{
    const res = await db
        .select( 'TripId' )
        .from( 'Trips' )

    console.log(res);

    return res;
}


export const getRides = async (db: Knex<any, unknown[]>): Promise<RideMeta[]> => {
    return await db.
        select( '*' )
        .from( { public: 'Trips' } )
        .orderBy( 'TripId' )
        .limit( 30 );
}

export const getinterpolatedRides = async (db: Knex<any, unknown[]>): Promise<RideMeta[]> => {
    return await db
        .select( '*' )
        .from( { public: 'Trips' } )
        .where( { 'TaskId': TASKID1 } );
}

// SELECT * FROM public."Measurements"
// WHERE "FK_Trip" = 'c1cf94d1-4957-467b-a61e-0d4f25b2a5ce'

// 3c2c473c-9b2f-4a07-8521-7ce21683c446