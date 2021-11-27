
import { RideMeta, Position3D, RideData, RidePos } from './models'
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
    const res: {lat: number, lon: number}[] = await db
        .select( select )
        .from( { public: 'Measurements' } )
        .where( query )
    return res.map( (pos: {lat: number, lon: number}) => { return {pos: {lat: pos.lat, lng: pos.lon} } } )
}

export const getMeasurements = async ( db: Knex<any, unknown[]> ): Promise<object[]> => {
    return await db.select( [ 'MeasurementTypeId', 'type' ] ).from( { public: 'MeasurementTypes' } )
}


export const getTrackPositions = async ( db: Knex<any, unknown[]>, [tripId]: [string] ): Promise<RideData> =>
{
    return await fetchPositions( db, [ 'lat', 'lon' ], {
        'FK_Trip': tripId,
        'FK_MeasurementType': TRACK_POS // NOT WORKING ANYMORE
    } )
}

export const getInterpolatedData = async ( db: Knex<any, unknown[]>, [tripId]: [string] ): Promise<RideData> =>
{
    return await fetchPositions(db, [ 'lat', 'lon' ], {
        'FK_Trip': tripId,
    } );
}

export const getAccelerationData = async ( db: Knex<any, unknown[]>, [tripId]: [string] ): Promise<Position3D[]> =>
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

export const getRPMS = async ( db: Knex<any, unknown[]>, [tripId]: [string] ): Promise<RideData> =>
{
    return await bigRequest(
        () => db
            .select( [ 'message', 'lat', 'lon' ] )
            .from( { public: 'Measurements' } )
            .where( { 'FK_Trip': tripId, 'T': 'obd.rpm' } ),
        (res: RideData) => res.map( (msg: any) => {
            const json = JSON.parse(msg.message)
            console.log(json);
            return { pos: { lat: msg.lat, lng: msg.lon }, value: json['obd.rpm.value'] }
        } )
    )
}

export const getTest = async ( db: Knex<any, unknown[]>, [tripId]: [string] ): Promise<any> =>
{
    tripId = 'b861b069-da00-4d02-b756-4031a9ec302e' // '004098a1-5146-4516-a8b7-ff98c13950aa'
    // const tag = 'acc.xyz'
    return await bigRequest(
        () => db
            .select( [ '*' ] )
            .from( { public: 'Measurements' } )
            .where( { 'FK_Trip': tripId } )
            .andWhereNot( { 'T': 'acc.xyz' } ),
        (res: Position3D[]) => res.map( (msg: any) => {
            const data = JSON.parse(msg.message)
            const tag = data['@t']
            for (const key in data) {
                if (!key.startsWith(tag)) continue;
                console.log(data);
                console.log(key, data[key]);
            }
            return { x: 0, y: 0, z: 0 }
        } )
    )
}


export const getMeasurementData = async ( db: Knex<any, unknown[]>, [tripId, measurement]: [string, string] ): Promise<RideData> =>
{
    // obd.bat
    // obd.rpm
    // track.pos (1493)
    // rpi.temp (1493)
    return await bigRequest(
        () => db
            .select( [ 'lon', 'lat', 'message' ] )
            .from( { public: 'Measurements' } )
            .where( { 'FK_Trip': tripId, 'T': measurement } ),
        (res: RideData) => res.map( (msg: any) => {
            const data = JSON.parse(msg.message)
            const tag = data['@t']
            const obj: any = {}
            for (const key in data) {
                if (!key.startsWith(tag)) continue;
                obj[key.replace(tag, '').substring(1)] = data[key];
            }
            return { pos: {lat: msg.lat, lng: msg.lon }, value: obj }
        } )
    )
}



export const getRides = async (db: Knex<any, unknown[]>): Promise<RideMeta[]> => {
    return await db
        .select( '*' )
        .from( { public: 'Trips' } );
}

export const getInterpolatedRides = async (db: Knex<any, unknown[]>): Promise<RideMeta[]> => {
    return await db
        .select( '*' )
        .from( { public: 'Trips' } )
        .where( { 'TaskId': TASKID1 } )
        .limit( 50 );
}

// 3c2c473c-9b2f-4a07-8521-7ce21683c446