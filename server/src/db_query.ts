
import { RideMeta, RidePos } from './models'

const MEASUREMENT_TYPE = 'a69d9fe0-7896-49e2-9e8d-e36f0d54f286'

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

export const getRides = async (db: any): Promise<RideMeta[]> => {
    return await db.
        select( '*' )
        .from( { public: 'Trips' } )
        .orderBy( 'TripId' )
        .limit( 30 );
}