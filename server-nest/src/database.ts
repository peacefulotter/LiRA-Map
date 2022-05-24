
import * as dotenv from "dotenv";
dotenv.config();

const { 
    DB_USER, DB_PASSWORD, 
    DB_USER_VIS, DB_PASSWORD_VIS, 
    DB_USER_POSTGIS, DB_PWD_POSTGIS 
} = process.env;


const BASE_CONFIG = {
    client: 'pg',
    debug: true,
    useNullAsDefault: true,
    pool: {
        min: 2,
        max: 10,
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

export const LIRA_DB_CONFIG = {
    ...BASE_CONFIG,
    connection: {
        host : "liradb.compute.dtu.dk", // "liradbdev.compute.dtu.dk",
        port: 5435,
        user : DB_USER,
        password : DB_PASSWORD,
        database : "postgres",
    },
}


export const VISUAL_DB_CONFIG = {
    ...BASE_CONFIG,
    connection: {
        host : "liravisualization.postgres.database.azure.com",
        port: 5432,
        user : DB_USER_VIS,
        password : DB_PASSWORD_VIS,
        database : "postgres",
        ssl: true
    },
}

export const POSTGIS_DB_CONFIG = {
    ...BASE_CONFIG,
    connection: {
        host : "liradb.postgres.database.azure.com",
        port: 5432,
        user : DB_USER_POSTGIS,
        password : DB_PWD_POSTGIS,
        database : "postgis",
        ssl: true
    },
}