
import http from 'http';
import { PointData, RideData } from './models';

// cd server/src/osrm
// ../../node_modules/osrm/lib/binding/osrm-extract denmark-latest.osm.pbf  -p ../../node_modules/osrm/profiles/car.lua
// const routing = new OSRM({path: './osrm/denmark-latest.osrm'});
// console.log(routing);

// ssh thinlinc.compute.dtu.dk -L 3000:localhost:5000 -l s212180
// curl http://liradbdev.compute.dtu.dk:5000/match/v1/car/12.5639696,55.7066193;12.5639715,55.7066193;12.5639753,55.7066193

const getOSRM = (path: string) => new Promise( (resolve, reject) => {
    http.get(`http://liradbdev.compute.dtu.dk:5000/match/v1/car/${path}`, (resp) => {
        let data = '';
        resp.on( 'data', (chunk) => data += chunk );
        resp.on('end', () => {
            console.log(data, JSON.parse(data));
            resolve(JSON.parse(data))
        })
    }).on( 'error', (err) => {
        console.log("OSRM Error: " + err.message);
        reject(err)
    })
} )

const osrmQuery = async (path: RideData): Promise<any> => {
    console.log(path.data.length);
    const filteredPath = path.data.filter((p, i) => i % 10 === 0 )
    console.log(filteredPath.length);

    const THRESHOLD = 100; // max number of points osrm can treat
    const chunkSize = Math.min(Math.max(Math.ceil( filteredPath.length / THRESHOLD ), 100), 20)

    const res: any[] = []
    for (let i = 0; i < filteredPath.length; i += chunkSize)
    {
        const query: string = filteredPath
            .slice(i, i + chunkSize)
            .map( (point: PointData) => point.pos.lat + ',' + point.pos.lon )
            .join(";")
        console.log(i, chunkSize);
        const data = await getOSRM(query)
        res.push(data)
    }

    return res;
}

export default osrmQuery;