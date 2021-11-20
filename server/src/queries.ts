
import { RideMeta, RidePos } from './models'
import { Knex } from 'knex'

import { Position3D } from './models'
import { o } from './osrm'
import { access } from 'fs'
import internal from 'stream'

const TRACK_POS = 'a69d9fe0-7896-49e2-9e8d-e36f0d54f286'
const ACC_XYZ = '666607b6-0baa-4eb7-b395-21d3ea654159'

const TASKID1 = 1608
const TASKID2 = 4032

const bigRequest = async <T>( request: () => any, treat: (res: T[]) => T[] ): Promise<T[]> => {
    const limit = 2000;

    const req = async (acc: T[], offset: number): Promise<T[]> => {
        const res: T[] = await request()
            .limit(limit)
            .offset(offset)

        const treated: T[] = treat(res)
        const updated: T[] = [...acc, ...treated];

        if ( res.length < limit ) return updated;
        else return req(updated, offset + limit);
    }

    return await req([], 0);
}

const fetchPositions = async ( db: Knex<any, unknown[]>, select: string[], query: object ): Promise<RidePos> =>
{
    return await db
        .select( select )
        .from( { public: 'Measurements' } )
        .where( query );
}

export const getMeasurements = async ( db: Knex<any, unknown[]> ): Promise<object[]> => {
    return await db.select( [ 'MeasurementTypeId', 'type' ] ).from( { public: 'MeasurementTypes' } )
}


export const getTrackPositions = async ( db: Knex<any, unknown[]>, tripId: string ): Promise<RidePos> =>
{
    return await fetchPositions( db, [ 'lat', 'lon' ], {
        'FK_Trip': tripId,
        'FK_MeasurementType': TRACK_POS // NOT WORKING ANYMORE
    } )
}

export const getInterpolatedData = async ( db: Knex<any, unknown[]>, tripId: string ): Promise<RidePos> =>
{
    return await fetchPositions(db, [ 'lat', 'lon' ], {
        'FK_Trip': tripId,
    } );
}

export const getAccelerationData = async ( db: Knex<any, unknown[]>, tripId: string ): Promise<Position3D[]> =>
{
    return await bigRequest(
        () => db
            .select( [ 'message' ] )
            .from( { public: 'Measurements' } )
            .where( { 'FK_Trip': tripId, 'T': 'acc.xyz' } ),
        (res: Position3D[]) => res.map( (msg: any) => {
            const data = JSON.parse(msg.message)
            return { x: data['acc.xyz.x'], y: data['acc.xyz.y'], z: data['acc.xyz.z'] }
        } )
    )
}

export const getTest = async ( db: Knex<any, unknown[]> ): Promise<any> =>
{
    // const res = await db
    //     .select( 'TripId' )
    //     .from( 'Trips' )

    // console.log(res);
    return await o()
}


export const getRides = async (db: Knex<any, unknown[]>): Promise<RideMeta[]> => {
    return await db
        .select( '*' )
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

// 3c2c473c-9b2f-4a07-8521-7ce21683c446