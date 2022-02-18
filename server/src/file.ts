import fs, { readdir } from 'fs'
import { readFile, writeFile } from 'fs/promises'
import { promisify } from 'util';
const readdirAsync = promisify( readdir )

const jsonFolder = './json/'

export const watchJsonDir = async (cb: (eventType: string, filename: string, data: string) => void) => {
    fs.watch( jsonFolder, (eventType: string, filename: string) => {
        console.log(eventType, filename);

        fs.readFile( jsonFolder + filename, 'utf8' , (err, data) => {
            if (err) return cb('deleted', filename, '')
            cb(eventType, filename, JSON.parse(data))
        })
    })
}

export const readJsonDir = async () => {
    const res = []
    const files = await readdirAsync( jsonFolder )
    for ( const filename of files )
    {
        const buffer = await readFile( jsonFolder + filename )
        const data = JSON.parse(buffer.toString('utf8', 0, buffer.length))
        res.push( { filename, data } )
    }
    console.log(res);

    return res;
}

// export const readJsonFile = async (filename: string) => {
//     console.log('[file] Read', filename)
// }

export const writeJsonFile = async (filename: string, data: any) => {
    await writeFile(jsonFolder + filename, JSON.stringify(data, null, 4), 'utf8' )
    console.log('[file] Wrote to', filename)
}