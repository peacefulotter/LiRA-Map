
import * as tunnel from 'tunnel-ssh';
import http from 'http';

import osrm from 'osrm';
const OSRM = osrm;
console.log(OSRM);

// cd server/src/osrm
// ../../node_modules/osrm/lib/binding/osrm-extract denmark-latest.osm.pbf  -p ../../node_modules/osrm/profiles/car.lua
// const routing = new OSRM({path: './osrm/denmark-latest.osrm'});
// console.log(routing);

import * as dotenv from "dotenv";
import database from './database';
dotenv.config( { path: __dirname + '/.env' } );

const env = process.env;

const { SSH_USERNAME, SSH_PASSWORD } = env;

const SSH_HOSTNAME = "thinlinc.compute.dtu.dk";
const SSH_PORT = 22;

const DB_HOST = "liradbdev.compute.dtu.dk";
const DB_PORT = 5000;

const LOCALHOST = "127.0.0.1"
const LOCALPORT = 3334


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



export const o = () => {
    return new Promise( (resolve, reject) => {
        const tnl = tunnel.default(SSH_CONFIG, async (errr: any, channel: any) => {
            if (errr) console.error("TUNNEL CREATION ERROR", errr);

            http.get('http://liradbdev.compute.dtu.dk:5000/match/v1/car//driving/12.428619,55.728325;12.428906,55.72822;12.434012,55.726135;12.429381,55.728004;12.440873,55.723522;12.429216,55.728092;12.431271,55.727303;12.442556,55.728474;12.436188,55.725235;12.436226,55.725235;12.436218,55.72524;12.436222,55.72523;12.436212,55.72524;12.436236,55.725254;12.44191,55.72814;12.442703,55.728546;12.441629,55.728004;12.445392,55.72992;12.444216,55.72932;12.445155,55.7298;12.435881,55.725063;12.436082,55.725166;12.435991,55.72512;12.436234,55.72525;12.435968,55.725113;12.435991,55.72513;12.458268,55.735558;12.467602,55.737133;12.463038,55.73676;12.446841,55.730667;12.457355,55.735256;12.474739,55.738358;12.475117,55.738403;12.473568,55.73816;12.483385,55.73923;12.481918,55.738937;12.49197,55.741615;12.493236,55.74229;12.493711,55.742886;12.494203,55.74495;12.494794,55.746117;12.49538,55.749146;12.49678,55.749115;12.49882,55.74877;12.501417,55.74858;12.503498,55.748577;12.508651,55.74855;12.508904,55.746735;12.524795,55.732803;12.524934,55.732418;12.524549,55.7334;12.5253935,55.730404;12.525268,55.73118;12.525321,55.730892;12.521915,55.737232;12.518824,55.739964;12.523354,55.73548;12.522374,55.736717;12.522633,55.73642;12.525233,55.726967;12.5286665,55.723717;12.529661,55.721928;12.529821,55.721184;12.530281,55.7202;12.529869,55.72046;12.530167,55.72;12.530014,55.72023;12.530167,55.72;12.5302515,55.720547;12.530353,55.720234?overview=false&alternatives=true&steps=true', (resp) => {
                let data = '';

                // A chunk of data has been received.
                resp.on( 'data', (chunk) => data += chunk );

                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                    console.log(JSON.parse(data));
                    resolve({data: JSON.parse(data), tnl})
                });

            }).on("error", (err) => {
                console.log("Error: " + err.message);
                reject({data: err, tnl})
            });
        })
    } ).then( ({ data, tnl }) => {
        tnl.close()
        return data;
    }).catch(   )
}