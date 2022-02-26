
import { RideMeta, Position3D, RideData, PointData } from './models'
import knex, { Knex } from 'knex'
import {DATABASE_CONFIG} from './database';



const fetchPositions = async (query: object ): Promise<RideData> =>
{
    const db: Knex<any, unknown[]> = knex(DATABASE_CONFIG);
    const res = await db
        .select( [ 'lat', 'lon' ] )
        .from( { public: 'Measurements' } )
        .where( query )
    return {
        data: res.map( (msg: any) => { return { pos: {lat: msg.lat, lon: msg.lon } } } )
    }
}

export const getAccelerationData = async ( [tripId]: [string] ): Promise<Position3D[]> =>
{
    const db: Knex<any, unknown[]> = knex(DATABASE_CONFIG);
    const res = await db
            .select( [ 'message' ] )
            .from( { public: 'Measurements' } )
            .where( { 'FK_Trip': tripId, 'T': 'acc.xyz' } );

    return res.map( (msg: any) => {
        const data = JSON.parse(msg.message)
        return { x: data['acc.xyz.x'], y: data['acc.xyz.y'], z: data['acc.xyz.z'] }
    } )
}

export const getTest = async ([tripId]: [string] ): Promise<any> =>
{
    const db: Knex<any, unknown[]> = knex(DATABASE_CONFIG);
    tripId = '2857262b-71db-49df-8db6-a042987bf0eb' // '004098a1-5146-4516-a8b7-ff98c13950aa'
    // const tag = 'acc.xyz'
    const res = await db
            .select( '*' )
            .from( { public: 'Measurements' } )
            .where( { 'FK_Trip': tripId } )
            .whereNot( { "T": 'acc.xyz' })
            .limit(100_000)
    console.log(res);

    return res;
}


export const getMeasurementData = async ( [tripId, measurement]: [string, string] ): Promise<RideData> =>
{
    // obd.spd
    // obd.rpm_rl
    // obd.acc_yaw
    // obd.acc_trans
    // obd.bat
    // obd.rpm
    // track.pos (1493)
    // rpi.temp (1493)
    const db: Knex<any, unknown[]> = knex(DATABASE_CONFIG);
    const res = await db
            .select( [ 'message', 'lat', 'lon', 'Created_Date' ] )
            .from( { public: 'Measurements' } )
            .where( { 'FK_Trip': tripId, 'T': measurement } );

    let minVal = Number.MAX_VALUE;
    let maxVal = -Number.MAX_VALUE;
    let minTime = Number.MAX_VALUE;
    let maxTime = -Number.MAX_VALUE;

    const data = res.map( (msg: any) => {
        const json = JSON.parse(msg.message)
        const value = json['obd.rpm.value'];
        const time = new Date(msg.Created_Date).getTime()

        minVal = Math.min(minVal, value);
        maxVal = Math.max(maxVal, value);
        minTime = Math.min(minTime, time)
        maxTime = Math.max(maxTime, time)

        return { pos: { lat: msg.lat, lon: msg.lon }, value, timestamp: time } as PointData
    } ).sort( (a: PointData, b: PointData) => a.timestamp - b.timestamp )

    return {
        data,
        minValue: minVal,
        maxValue: maxVal,
        minTime,
        maxTime
    }


    // const res = await db
    //         .select( [ 'lon', 'lat', 'message' ] )
    //         .from( { public: 'Measurements' } )
    //         .where( { 'FK_Trip': tripId, 'T': measurement } );

    // return {
    //     data: res.map( (msg: any) => {
    //         const data = JSON.parse(msg.message)
    //         const tag = data['@t']
    //         const obj: any = {}
    //         for (const key in data) {
    //             if (!key.startsWith(tag)) continue;
    //             obj[key.replace(tag, '').substring(1)] = data[key];
    //         }
    //         return { pos: { lat: msg.lat, lon: msg.lon }, value: obj }
    //     } )
    // }
}



export const getRides = async (): Promise<RideMeta[]> => {
    const db: Knex<any, unknown[]> = knex(DATABASE_CONFIG);
    const res: RideMeta[] = await db
        .select( '*' )
        .from( { public: 'Trips' } );

    const time = (md: RideMeta) => new Date(md.Created_Date).getTime()

    return res
        .filter((a: RideMeta) => a.TaskId !== 0)
        .sort((a: RideMeta, b: RideMeta) => time(a) - time(b))
}

// 3c2c473c-9b2f-4a07-8521-7ce21683c446