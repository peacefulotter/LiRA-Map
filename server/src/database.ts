import knex, { Knex } from 'knex';

import * as dotenv from "dotenv";
dotenv.config( { path: __dirname + '/.env' } );

const { DB_USER, DB_PASSWORD } = process.env;

const DB_NAME = "postgres";
const DB_HOST = "liradb.compute.dtu.dk"; // "liradbdev.compute.dtu.dk"
const DB_PORT = 5435; // 5432;

export const DATABASE_CONFIG = {
    client: 'pg',
    connection: {
          host : DB_HOST,
          port: DB_PORT,
          user : DB_USER,
          password : DB_PASSWORD,
          database : DB_NAME,
    },
    debug: true,
    pool: {
        min: 1,
        max: 7,
        "createTimeoutMillis": 3000,
        "acquireTimeoutMillis": 30000,
        "idleTimeoutMillis": 30000,
        "reapIntervalMillis": 1000,
        "createRetryIntervalMillis": 100,
        "propagateCreateError": false
    },
    log: {
        warn(msg: any) { console.log('warning', msg); },
        error(msg: any) { console.log('error', msg); },
        deprecate(msg: any) { console.log('deprecate', msg); },
        debug(msg: any) { console.log('debug', msg); },
    }
}

export const db: Knex<any, unknown[]> = knex(DATABASE_CONFIG);


// http://liradbdev.compute.dtu.dk:5000/match/v1/car/12.5639696,55.7066193;12.5639715,55.7066193;12.5639753,55.7066193
type Func<T> = (...args: any[]) => Promise<T>;

const databaseQuery = async <T>(func: Func<T>, ...args: any[]): Promise<T> => {
    const database: Knex<any, unknown[]> = knex(DATABASE_CONFIG);
    const res: T = await func(args);
    await database.destroy();
    return res;
}


export default databaseQuery

