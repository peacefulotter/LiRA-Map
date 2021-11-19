
import * as tunnel from 'tunnel-ssh';
import knex, { Knex } from 'knex';

import { Express } from 'express';
import http from 'http';
import { Server } from 'net';

import { Position3D, RideMeta, RidePos } from './models'
import { getRides, getTrackPositions, getTest, getAccelerationData, getInterpolatedData } from './queries';

import * as dotenv from "dotenv";
dotenv.config( { path: __dirname + '/.env' } );

const env = process.env;

const { SSH_USERNAME, SSH_PASSWORD, DB_USER, DB_PASSWORD } = env;

const SSH_HOSTNAME = "thinlinc.compute.dtu.dk";
const SSH_PORT = 22;

const DB_NAME = "postgres";
// const DB_HOST = "liradbdev.compute.dtu.dk";
// const DB_PORT = 5432;

const DB_HOST = "liradb.compute.dtu.dk";
const DB_PORT = 5435;

const LOCALHOST = "127.0.0.1"
const LOCALPORT = 3333


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
    client: 'postgres',
    connection: {
          host : LOCALHOST,
          port: LOCALPORT,
          user : DB_USER,
          password : DB_PASSWORD,
          database : DB_NAME,
    },
    pool: {
        min: 2,
        max: 6,
        "createTimeoutMillis": 3000,
        "acquireTimeoutMillis": 30000,
        "idleTimeoutMillis": 30000,
        "reapIntervalMillis": 1000,
        "createRetryIntervalMillis": 100,
        "propagateCreateError": false
    }
}

// http://liradbdev.compute.dtu.dk:5000/match/v1/car/12.5639696,55.7066193;12.5639715,55.7066193;12.5639753,55.7066193


export const db = (app: Express, httpServer: http.Server) => {
    const tnl = tunnel.default(SSH_CONFIG, async (err: any, channel: Server) => {
        if (err) console.error("TUNNEL CREATION ERROR", err);

        const database: Knex<any, unknown[]> = knex(DATABASE_CONFIG);


        app.post("/ride", async (req: any, res: any) => {
            const TRIP_ID = req.body.tripID; // '7f67425e-26e6-4af3-9a6f-f72ff35a7b1a';
            console.log("Requested ride ", TRIP_ID);
            const data: RidePos = await getTrackPositions( database, TRIP_ID );
            res.json( data );
        } )

        app.post("/inter_ride", async (req: any, res: any) => {
            const TRIP_ID = req.body.tripID;
            console.log("Requested ride ", TRIP_ID);
            const data: RidePos = await getInterpolatedData( database, TRIP_ID );
            res.json( data );
        } )

        app.get("/rides", async (req: any, res: any) => {
            console.log("getting rides");

            const data: RideMeta[] = await getRides(database)
            // const data: RideMeta[] = await getinterpolatedRides(database)
            res.json( data )
        } )

        app.post("/acc", async (req: any, res: any) => {
            const TRIP_ID = req.body.tripID;
            console.log("Requested acc ", TRIP_ID);
            const data: Position3D[] = await getAccelerationData(database, TRIP_ID);
            res.json( data )
        })


        app.get("/test", async (req: any, res: any) => {
            console.log("Requested /test ");
            const data: any = await getTest(database);
            res.json( data )
        })


        // Nodemon reload, clean close so that it can restart properly
        const closeConnection = () => {
            console.log("TUNNEL AND DB CLOSING");
            database.destroy();
            channel.close();
            tnl.close();
            httpServer.close();
        }

        process.on( "SIGHUP", closeConnection );
        process.on( "SIGUSR2", closeConnection )

        tnl.on('error', (errr) => { console.error('Something bad happened:', errr); closeConnection() } );

    })

    console.log(tnl);
}



export default { db }

