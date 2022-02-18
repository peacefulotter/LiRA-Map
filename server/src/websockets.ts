import { WebSocketServer } from 'ws';
import { readJsonDir, watchJsonDir } from './file';


const initWebsockets = async (server: any) => {

    const wss = new WebSocketServer( { server } );

    wss.on('connection', async ws => {

        ws.on('message', data => {
            console.log('received: ', data);
        });

        const payload = JSON.stringify( {
            type: 'CONNECTED',
            files: await readJsonDir()
        } )
        ws.send( payload );
    });


    watchJsonDir( (eventType: string, filename: string, data: string) => {
        console.log(eventType);
        const notif = JSON.stringify( { type: eventType, filename, data } )
        wss.clients.forEach( client => client.send(notif))
    })

}

export default initWebsockets;