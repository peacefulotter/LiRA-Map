import fs, { watch } from 'fs'
import { readFile } from 'fs/promises'
import { promisify } from 'util';
import { WebSocketServer } from 'ws';

const readdir = promisify( require( 'fs' ).readdir )
const watchDir = './json/'

const readAllFiles = async () => {
    const res = []
    const files = await readdir( watchDir )
    for ( const filename of files )
    {
        const buffer = await readFile(watchDir + filename)
        const data = JSON.parse(buffer.toString('utf8', 0, buffer.length))
        res.push( { filename, data } )
    }
    console.log(res);
    
    return res;
}

const initWebsockets = async (server: any) => {

    const wss = new WebSocketServer( { server } );

    wss.on('connection', async ws => {
        
        ws.on('message', data => {
            console.log('received: ', data);
        });
      
        const payload = JSON.stringify( {
            type: 'CONNECTED', 
            files: await readAllFiles()
        } )
        ws.send( payload );
    });


    fs.watch(watchDir, (eventType, filename) => {
        console.log(filename);

        fs.readFile( watchDir + filename, 'utf8' , (err, data) => {
            if (err) return console.error(err)
            const notif = JSON.stringify( { type: 'filechange', filename, data } )
            wss.clients.forEach( client => client.send(notif))
        })
    })

}

export default initWebsockets;