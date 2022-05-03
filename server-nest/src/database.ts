import knex, { Knex } from 'knex';

import * as dotenv from "dotenv";
dotenv.config( { path: __dirname + '/.env' } );

// CONFIG FOR MAIN DATABASE

const { DB_USER, DB_PASSWORD, DB_USER_VIS, DB_PASSWORD_VIS } = process.env;

const DB_NAME = "postgres";
const DB_HOST = "liradb.compute.dtu.dk"; // "liradbdev.compute.dtu.dk"
const DB_PORT = 5435; // 5432;


// CONFIG FOR VISUALIZATION DATABASE
const DB_HOST_VIS = "liravisualization.postgres.database.azure.com";
const DB_PORT_VIS = 5432;

const BASE_CONFIG = {
    client: 'pg',
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

const LIRADB_CONFIG = {
    ...BASE_CONFIG,
    connection: {
        host : DB_HOST,
        port: DB_PORT,
        user : DB_USER,
        password : DB_PASSWORD,
        database : DB_NAME,
    },
}

const VISUAL_CONFIG = {
    ...BASE_CONFIG,
    connection: {
        host : DB_HOST_VIS,
        port: DB_PORT_VIS,
        user : DB_USER_VIS,
        password : DB_PASSWORD_VIS,
        database : DB_NAME,
        ssl: true
    },
}


type Func<T> = (db: Knex<any, unknown[]>, ...args: any[]) => Promise<T>;
type Database = 'liradb' | 'visual'

const databaseQuery = async <T>(func: Func<T>, kind: Database, ...args: any[]): Promise<T> => {
    dotenv.config( { path: __dirname + '/.env' } );
    const config = kind === 'liradb' ? LIRADB_CONFIG : VISUAL_CONFIG;
    console.log(config);
    
    const database: Knex<any, unknown[]> = knex(config);
    let res: T;
    try {
        res = await func(database, args);
        await database.destroy();
    } catch (error) {
        console.error(error)
    }
    return res;
}


export default databaseQuery

