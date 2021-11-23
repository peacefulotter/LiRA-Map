
import { RideMeta, Position3D, RideData } from './models'
import { Knex } from 'knex'

const TRACK_POS = 'a69d9fe0-7896-49e2-9e8d-e36f0d54f286'
const ACC_XYZ = '666607b6-0baa-4eb7-b395-21d3ea654159'

const TASKID1 = 1608
const TASKID2 = 4032

const bigRequest = async <T>( request: () => any, treat: (res: T[]) => T[] ): Promise<T[]> => {
    const limit = 200;

    const req = async (acc: T[], offset: number): Promise<T[]> => {
        const res: T[] = await request()
            .limit(limit)
            .offset(offset)
        console.log(res);

        const treated: T[] = treat(res)
        const updated: T[] = [...acc, ...treated];

        if ( res.length < limit ) return updated;
        else return req(updated, offset + limit);
    }

    return await req([], 0);
}

const fetchPositions = async ( db: Knex<any, unknown[]>, select: string[], query: object ): Promise<RideData> =>
{
    return await db
        .select( select )
        .from( { public: 'Measurements' } )
        .where( query );
}

export const getMeasurements = async ( db: Knex<any, unknown[]> ): Promise<object[]> => {
    return await db.select( [ 'MeasurementTypeId', 'type' ] ).from( { public: 'MeasurementTypes' } )
}


export const getTrackPositions = async ( db: Knex<any, unknown[]>, tripId: string ): Promise<RideData> =>
{
    return await fetchPositions( db, [ 'lat', 'lon' ], {
        'FK_Trip': tripId,
        'FK_MeasurementType': TRACK_POS // NOT WORKING ANYMORE
    } )
}

export const getInterpolatedData = async ( db: Knex<any, unknown[]>, tripId: string ): Promise<RideData> =>
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

export const getRPMS = async ( db: Knex<any, unknown[]>, tripId: string ): Promise<RideData> =>
{
    return await bigRequest(
        () => db
            .select( [ 'message', 'lat', 'lon' ] )
            .from( { public: 'Measurements' } )
            .where( { 'FK_Trip': tripId, 'T': 'obd.rpm' } ),
        (res: RideData) => res.map( (msg: any) => {
            const json = JSON.parse(msg.message)
            console.log(json);
            return { pos: { lat: msg.lat, lng: msg.lon }, val: json['obd.rpm.value'] }
        } )
    )
}

export const getTest = async ( db: Knex<any, unknown[]> ): Promise<any> =>
{
    const tripId = 'c1cf94d1-4957-467b-a61e-0d4f25b2a5ce' // '004098a1-5146-4516-a8b7-ff98c13950aa'
    // const res = await db
    //     .select( 'TripId' )
    //     .from( 'Trips' )

    // console.log(res);
    // return await o()
    return await bigRequest(
        () => db
            .select( '*' )
            .from( { public: 'Measurements' } )
            .where( { 'FK_Trip': tripId, 'T': 'obd.rpm' } ),
        (res: any[]) => res.map( (msg: any) => {
            const data = JSON.parse(msg)
            console.log(data);
            return data
        } )
    )
}


export const getRides = async (db: Knex<any, unknown[]>): Promise<RideMeta[]> => {
    return await db
        .select( '*' )
        .from( { public: 'Trips' } )
        .limit( 30 );
}

export const getInterpolatedRides = async (db: Knex<any, unknown[]>): Promise<RideMeta[]> => {
    return await db
        .select( '*' )
        .from( { public: 'Trips' } )
        .where( { 'TaskId': TASKID1 } )
        .limit( 50 );
}

// 3c2c473c-9b2f-4a07-8521-7ce21683c446