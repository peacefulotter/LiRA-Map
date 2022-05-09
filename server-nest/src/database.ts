
import * as dotenv from "dotenv";
dotenv.config();

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
        host : DB_HOST,
        port: DB_PORT,
        user : DB_USER,
        password : DB_PASSWORD,
        database : DB_NAME,
    },
}


export const VISUAL_DB_CONFIG = {
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