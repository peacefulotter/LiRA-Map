import * as tunnel from 'tunnel-ssh';
import knex, { Knex } from 'knex';

import { Express } from 'express';
import http from 'http';
import { Server } from 'net';

import { Position3D, RideMeta, RideData } from './models'
import { getRides, getInterpolatedRides, getTrackPositions, getTest, getAccelerationData, getInterpolatedData, getMeasurements, getRPMS } from './queries';
import VPN from './vpn'

import * as dotenv from "dotenv";
dotenv.config( { path: __dirname + '/.env' } );

const env = process.env;

const { SSH_USERNAME, SSH_PASSWORD, DB_USER, DB_PASSWORD } = env;

const DB_NAME = "postgres";
// const DB_HOST = "liradbdev.compute.dtu.dk";
// const DB_PORT = 5432;
const DB_HOST = "liradb.compute.dtu.dk";
const DB_PORT = 5435;
const LOCALHOST = "127.0.0.1"
const LOCALPORT = 3333

const SSH_HOSTNAME = "thinlinc.compute.dtu.dk";
const SSH_PORT = 22;
const SSH_CONFIG = {
	host: SSH_HOSTNAME,
	port: SSH_PORT,
	username: SSH_USERNAME,
	password: SSH_PASSWORD,
	keepaliveInterval: 60000,
	keepAlive: true,
	dstHost: DB_HOST,
	dstPort: DB_PORT,
	localHost: LOCALHOST,
	localPort: LOCALPORT
};

const DATABASE_CONFIG = {
    client: 'pg',
    connection: {
          host : LOCALHOST,
          port: LOCALPORT,
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


let vpnConnected = false;

// http://liradbdev.compute.dtu.dk:5000/match/v1/car/12.5639696,55.7066193;12.5639715,55.7066193;12.5639753,55.7066193
type Func<T> = (db: Knex<any, unknown[]>, tripId: string) => Promise<T>;

const getDatabase = <T>(func: Func<T>, tripID: string): Promise<T> => {
    return new Promise( async (resolve, reject) => {
        if ( !vpnConnected )
        {
            const vpn = await VPN.connect( SSH_USERNAME, SSH_PASSWORD )
            console.log(vpn);
            vpnConnected = true;
            console.log("vpn connected");
        }
        const tnl = tunnel.default(SSH_CONFIG, async (err: any, channel: Server) => {
            if (err)
            {
                console.error("TUNNEL CREATION ERROR", err);
                reject(err);
            }
            const database: Knex<any, unknown[]> = knex(DATABASE_CONFIG);
            const res: T = await func(database, tripID);
            console.log(res);


            // closing everything
            await database.destroy();
            channel.close((errr) => console.log('close channel err', errr) )

            resolve(res);
        })

        tnl.on('error', (errr) => { console.error('Something bad happened:', errr); tnl.close() } );
    })
}



export const db = (app: Express, httpServer: http.Server) => {
    const cleanup = () => {
        if ( vpnConnected )
            VPN.disconnect()
        httpServer.close()
    }

    process.on( "SIGHUP",  cleanup );
    process.on( "SIGUSR2", cleanup );
    process.on( "SIGQUIT", cleanup );
    process.on( "SIGINT",  cleanup );
    process.on( "SIGTERM", cleanup );
    // const tnl = tunnel.default(SSH_CONFIG, async (err: any, channel: Server) => {
    //    if (err) console.error("TUNNEL CREATION ERROR", err);

    //    const database: Knex<any, unknown[]> = knex(DATABASE_CONFIG);


        // app.get("/measurements", async (req: any, res: any) => {
        //     console.log("Requested measurements");
        //     const data: object[] = await getMeasurements( database );
        //     res.json( data );
        // } )

        app.get("/rides", async (req: any, res: any) => {
            console.log("getting rides");
            const data: RideMeta[] = await getDatabase<RideMeta[]>(getRides, '')// await getRides(database)
            res.json( data )
        } )

        // RIDE-DATA
        // app.post("/trackpos", async (req: any, res: any) => {
        //     const TRIP_ID = req.body.tripID; // '7f67425e-26e6-4af3-9a6f-f72ff35a7b1a';
        //     console.log("Requested ride ", TRIP_ID);
        //     const data: RideData = await getTrackPositions( database, TRIP_ID );
        //     res.json( data );
        // } )

        // app.post("/interpolation", async (req: any, res: any) => {
        //     const TRIP_ID = req.body.tripID;
        //     console.log("Requested ride ", TRIP_ID);
        //     const data: RideData = await getInterpolatedData( database, TRIP_ID );
        //     res.json( data );
        // } )

        // app.post("/map_match", async (req: any, res: any) => {
        //     const TRIP_ID = req.body.tripID;
        //     console.log("Requested ride ", TRIP_ID);
        //     const data: RideData = await getInterpolatedData( database, TRIP_ID );
        //     res.json( data );
        // } )

        app.post("/rpms", async (req: any, res: any) => {
            const TRIP_ID = 'c1cf94d1-4957-467b-a61e-0d4f25b2a5ce' // req.body.tripID;
            console.log("Requested rpms ", TRIP_ID);
            const data: RideData = await getDatabase<RideData>(getRPMS, TRIP_ID) // await getRPMS( database, TRIP_ID );
            res.json( data );
        } )


        // app.post("/acc", async (req: any, res: any) => {
        //     const TRIP_ID = req.body.tripID;
        //     console.log("Requested acc ", TRIP_ID);
        //     const data: Position3D[] = await getAccelerationData(database, TRIP_ID);
        //     res.json( data )
        // })


        // app.get("/test", async (req: any, res: any) => {
        //     console.log("Requested /test ");
        //     const data: any = await getTest(database);
        //     res.json( data )
        // })


        // Nodemon reloads, clean close so that it can restart properly
        // const closeConnection = () => {
        //     console.log("TUNNEL AND DB CLOSING");
        //     database.destroy();
        //     channel.close();
        //     tnl.close();
        //     httpServer.close();
        // }

        // process.on( "SIGHUP", closeConnection );
        // process.on( "SIGUSR2", closeConnection )

        // tnl.on('error', (errr) => { console.error('Something bad happened:', errr); closeConnection() } );

    // })

    // console.log(tnl);
}



export default { db }

