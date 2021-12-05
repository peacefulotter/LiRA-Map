
import { RideMeta, Position3D, RideData, PointData } from './models'
import { Knex } from 'knex'


const fetchPositions = async ( db: Knex<any, unknown[]>, query: object ): Promise<RideData> =>
{
    return {
        data: await db
            .select( [ 'lat', 'lon' ] )
            .from( { public: 'Measurements' } )
            .where( query )
    }
}

export const getMeasurements = async ( db: Knex<any, unknown[]> ): Promise<object[]> => {
    return await db.select( [ 'MeasurementTypeId', 'type' ] ).from( { public: 'MeasurementTypes' } )
}


export const getTrackPositions = async ( db: Knex<any, unknown[]>, [tripId]: [string] ): Promise<RideData> =>
{
    return await fetchPositions( db, {
        'FK_Trip': tripId,
        'T': 'track.pos'
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

export const getRPMS = async ( db: Knex<any, unknown[]>, [tripId]: [string] ): Promise<RideData> =>
{
    const res = await db
            .select( [ 'message', 'lat', 'lon', 'Created_Date' ] )
            .from( { public: 'Measurements' } )
            .where( { 'FK_Trip': tripId, 'T': 'obd.rpm' } );

    let minVal = -Number.MAX_VALUE;
    let maxVal = Number.MAX_VALUE;
    let minTime = -Number.MAX_VALUE;
    let maxTime = Number.MAX_VALUE;

    const data = res.map( (msg: any) => {
        const json = JSON.parse(msg.message)
        const value = json['obd.rpm.value'];
        const time = new Date(msg.Created_Date).getTime()

        minVal = Math.min(minVal, value);
        maxVal = Math.max(maxVal, value);
        minTime = Math.min(minTime, time)
        maxTime = Math.min(maxTime, time)

        return { pos: { lat: msg.lat, lon: msg.lon }, value, timestamp: time } as PointData
    } )

    return {
        data,
        minValue: minVal,
        maxValue: maxVal,
        minTime,
        maxTime
    }

}

export const getTest = async ( db: Knex<any, unknown[]>, [tripId]: [string] ): Promise<any> =>
{
    tripId = 'b861b069-da00-4d02-b756-4031a9ec302e' // '004098a1-5146-4516-a8b7-ff98c13950aa'
    // const tag = 'acc.xyz'
    const res = await db
            .select( ['lon', 'lat', 'message', 'Created_Date'] )
            .from( { public: 'Measurements' } )
            .where( { 'FK_Trip': tripId } )

    return res;
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

    return {
        data: res.map( (msg: any) => {
            const data = JSON.parse(msg.message)
            const tag = data['@t']
            const obj: any = {}
            for (const key in data) {
                if (!key.startsWith(tag)) continue;
                obj[key.replace(tag, '').substring(1)] = data[key];
            }
            return { pos: { lat: msg.lat, lon: msg.lon }, value: obj }
        } )
    }
}



export const getRides = async (db: Knex<any, unknown[]>): Promise<RideMeta[]> => {
    const res: RideMeta[] = await db
        .select( '*' )
        .from( { public: 'Trips' } );

    const time = (md: RideMeta) => new Date(md.Created_Date).getTime()

    return res
        .filter((a: RideMeta) => a.TaskId !== 0)
        .sort((a: RideMeta, b: RideMeta) => time(a) - time(b))
}

// 3c2c473c-9b2f-4a07-8521-7ce21683c446