import { knex } from 'knex'

export interface MeasurementRow {
    MeasurementId: string
    TS_or_Distance: Date
    Created_Date: Date
    Updated_Date: Date
    lat: number
    lon: number
    isComputed: boolean
    FK_Trip: string
    FK_MeasurementType: string
    T: string
    message: string
}

export class EnergyDB {
    private readonly liradb = knex({
        client: 'pg',
        connection: {
            host: 'se2-e.compute.dtu.dk',
            port: 5432,
            user: 'lira',
            password: 'lira',
            database: 'liradb',
        },
        searchPath: ['knex', 'public', 'lira'],
    });


    public async persist(data?: any) {
        var measurement : MeasurementRow = {
            MeasurementId: "00000000-0000-0000-0000-000000000000",
            TS_or_Distance: new Date("2021-04-28 09:22:26.876 +0200"),
            Created_Date: new Date("2021-04-28 09:22:26.876 +0200"),
            Updated_Date: new Date("2021-04-28 09:22:26.876 +0200"),
            lat: 55.72779,
            lon: 12.52296,
            isComputed: true,
            FK_Trip: "00000000-0000-0000-0000-000000000000",
            FK_MeasurementType: "00000000-0000-0000-0000-000000000000",
            T: "obd.rpm",
            message: '{"id":"someid"}'
        }
        this.liradb.insert(measurement).into('measurements')
            .then(() => {
                console.log('PostgreSQL connected');
            })
            .catch((e) => {
                console.log('PostgreSQL not connected');
                console.error(e);
            });
    }
}