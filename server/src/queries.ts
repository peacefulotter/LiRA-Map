
import { RideMeta, Position3D, RideData, RidePos } from './models'
import { Knex } from 'knex'

const TRACK_POS = 'a69d9fe0-7896-49e2-9e8d-e36f0d54f286'
const ACC_XYZ = '666607b6-0baa-4eb7-b395-21d3ea654159'

const TASKID1 = 1608
const TASKID2 = 4032

const fetchPositions = async ( db: Knex<any, unknown[]>, query: object ): Promise<RideData> =>
{
    const res: {lat: number, lon: number}[] = await db
        .select( [ 'lat', 'lon' ] )
        .from( { public: 'Measurements' } )
        .where( query )
    return res.map( (pos: {lat: number, lon: number}) => { return {pos: {lat: pos.lat, lng: pos.lon} } } )
}

export const getMeasurements = async ( db: Knex<any, unknown[]> ): Promise<object[]> => {
    return await db.select( [ 'MeasurementTypeId', 'type' ] ).from( { public: 'MeasurementTypes' } )
}


export const getTrackPositions = async ( db: Knex<any, unknown[]>, [tripId]: [string] ): Promise<RideData> =>
{
    return await fetchPositions( db, {
        'FK_Trip': tripId,
        'T': 'track.pos' // NOT WORKING ANYMORE
    } )
}

export const getInterpolatedData = async ( db: Knex<any, unknown[]>, [tripId]: [string] ): Promise<RideData> =>
{
    return await fetchPositions(db, {
        'FK_Trip': tripId,
    } );
}

export const getAccelerationData = async ( db: Knex<any, unknown[]>, [tripId]: [string] ): Promise<Position3D[]> =>
{
    const res = await db
            .select( [ 'message' ] )
            .from( { public: 'Measurements' } )
            .where( { 'FK_Trip': tripId, 'T': 'acc.xyz' } );

    return res.map( (msg: any) => {
        const data = JSON.parse(msg.message)
        return { x: data['acc.xyz.x'], y: data['acc.xyz.y'], z: data['acc.xyz.z'] }
    } )
}

// TODO get timestamp for each coord
export const getRPMS = async ( db: Knex<any, unknown[]>, [tripId]: [string] ): Promise<RideData> =>
{
    const res = await db
            .select( [ 'message', 'lat', 'lon', 'Created_Date' ] )
            .from( { public: 'Measurements' } )
            .where( { 'FK_Trip': tripId, 'T': 'obd.rpm' } );

    return res.map( (msg: any) => {
        const json = JSON.parse(msg.message)
        return { pos: { lat: msg.lat, lng: msg.lon }, value: json['obd.rpm.value'], timestamp: new Date(msg.Created_Date).getTime() }
    } ).sort( (a, b) => a.timestamp - b.timestamp )
}

export const getTest = async ( db: Knex<any, unknown[]>, [tripId]: [string] ): Promise<any> =>
{
    tripId = 'b861b069-da00-4d02-b756-4031a9ec302e' // '004098a1-5146-4516-a8b7-ff98c13950aa'
    // const tag = 'acc.xyz'
    const res = await db
            .select( ['lon', 'lat', 'message', 'Created_Date'] )
            .from( { public: 'Measurements' } )
            .where( { 'FK_Trip': tripId } )

    res.forEach( r => {
        const json = JSON.parse(r.message)
        console.log(json['@ts'], json['@rec'], r.Created_Date);
    })

    const s = res.sort((a: any, b: any) => new Date(a.Created_Date).getTime() - new Date(b.Created_Date).getTime() )
    return s;

}


export const getMeasurementData = async ( db: Knex<any, unknown[]>, [tripId, measurement]: [string, string] ): Promise<RideData> =>
{
    // obd.spd
    // obd.rpm_rl
    // obd.acc_yaw
    // obd.acc_trans
    // obd.bat
    // obd.rpm
    // track.pos (1493)
    // rpi.temp (1493)
    const res = await db
            .select( [ 'lon', 'lat', 'message' ] )
            .from( { public: 'Measurements' } )
            .where( { 'FK_Trip': tripId, 'T': measurement } );

    return res.map( (msg: any) => {
        const data = JSON.parse(msg.message)
        const tag = data['@t']
        const obj: any = {}
        for (const key in data) {
            if (!key.startsWith(tag)) continue;
            obj[key.replace(tag, '').substring(1)] = data[key];
        }
        return { pos: {lat: msg.lat, lng: msg.lon }, value: obj }
    } )
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