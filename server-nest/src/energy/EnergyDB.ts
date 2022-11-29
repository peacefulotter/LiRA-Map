import { knex } from 'knex'

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


    public async persist(data: any) {
        this.liradb.insert().into('measurements')
            .then(() => {
                console.log('PostgreSQL connected');
            })
            .catch((e) => {
                console.log('PostgreSQL not connected');
                console.error(e);
            });
    }
}