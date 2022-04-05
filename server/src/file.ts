import fs, { readdir } from 'fs'
import { readFile, writeFile } from 'fs/promises'
import { promisify } from 'util';
import { JSONProps, Measurement } from './models';
const readdirAsync = promisify( readdir )

const jsonFolder = './json/'

interface FileChange {
    eventType: string;
    filename: string;
}

type Callback = (eventType: string, filename: string, data: JSONProps) => void


let busyWriting = false;
const queue: FileChange[] = []
let callCallback: (eventType: string, filename: string) => Promise<void>;

const watchDirCallback = (cb: Callback) => async (eventType: string, filename: string) => {
    const json = await readJsonFile(filename)
    if ( json === null )
        cb('deleted', filename, null)
    else
        cb(eventType, filename, json)
}



export const watchJsonDir = async (cb: Callback) => {
    callCallback = watchDirCallback(cb);

    fs.watch( jsonFolder, async (eventType: string, filename: string) => {
        console.log('[watchJsonDir - cb]', eventType, 'from', filename)

        if ( busyWriting )
        {
            console.log('BUSY - ADDING TO QUEUE')
            queue.push( { eventType, filename } )
        }
        else
            await callCallback(eventType, filename)
    })
}

export const readJsonDir = async () => {
    const res: Measurement[] = []
    const files = await readdirAsync( jsonFolder )

    for ( const filename of files )
    {
        const buffer = await readFile( jsonFolder + filename )
        const data: JSONProps = JSON.parse(buffer.toString('utf8', 0, buffer.length))
        res.push( data.properties )
    }

    return res;
}

export const readJsonFile = async (filename: string): Promise<JSONProps | undefined> => {
    try {
        const buffer = await readFile( jsonFolder + filename + '.json' )
        return JSON.parse(buffer.toString('utf8', 0, buffer.length))
    }
    catch {
        console.log('Couldn\'t read file ', filename);
    }
    return undefined
}

export const writeJsonFile = async (fn: string, data: any) => {
    busyWriting = true;
    await writeFile(jsonFolder + fn, JSON.stringify(data, null, 4), 'utf8' )
    console.log(queue)
    while ( queue.length > 0 )
    {
        const { eventType, filename } = queue.pop()
        callCallback(eventType, filename)
    }

    busyWriting = false
    console.log('[writeJsonFile]', fn)
}