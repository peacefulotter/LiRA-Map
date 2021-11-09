
import { RoadSegments, RideMeta, Ride, RoadCondition } from './models'


export const ggQuery = async (db: any) =>
{
    const queryRes = await db
        .select('*')
        .from( { public: "Measurements" } )
        .where( {
            "FK_Trip": '7f67425e-26e6-4af3-9a6f-f72ff35a7b1a',
            "FK_MeasurementType": 'a69d9fe0-7896-49e2-9e8d-e36f0d54f286'
        } );

    queryRes.shift()
    console.log(queryRes);

    const path = queryRes.map( (trackPos: any, i: number) => {

        return { lat: trackPos.lat, lng: trackPos.lon }
    })
    const firstSegments: RoadSegments = [
        { 'path': path,
            'condition': RoadCondition.Good
        }
        ]
    const firstMeta: RideMeta = { time: 20, distance: 20,
        start_time: new Date(2018, 0O5, 0O5, 17, 23, 42, 11).toLocaleString(),
        end_time: new Date(2018, 0O5, 0O5, 17, 55, 12, 11).toLocaleString(),
        source: 'Lundtofteparken', destination: 'Norreport'}
    const firstRide: Ride = { meta: firstMeta, segments: firstSegments }
    return [ firstRide ];
}

export const example = async (db: any) => 
{
    return await db
        .select('*')
        .from( { public: "Measurements" } )
        .where( {
            "FK_Trip": '7f67425e-26e6-4af3-9a6f-f72ff35a7b1a',
            "FK_MeasurementType": 'a69d9fe0-7896-49e2-9e8d-e36f0d54f286'
        } );
}