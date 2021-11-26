
import tmp from 'tmp';
import { writeFile } from'fs'
import { exec } from 'child_process'

const VPN_HOST = 'openvpn.compute.dtu.dk'
const VPN_EXEC = '/opt/cisco/anyconnect/bin/vpn'

const VPN = {
    connect: (username: string, password: string): Promise<void> =>
        new Promise( (resolve, reject) =>
            tmp.file({ prefix: 'vpn-', postfix: '.txt' }, (err, path, fd, cleanup) => {
                if (err) reject(err)
                else writeFile(path, `${username}\n${password}\n`, errr => {
                    if (errr) reject(errr)
                    else exec(`"${VPN_EXEC}" connect ${VPN_HOST} -s < ${path}`, (errrr, stdout) => {
                        if (errrr) reject(errrr)
                        setTimeout(() => {
                            console.log("EXEC WORKED");
                            cleanup()
                            resolve()
                        }, 15000)
                    })
                })
            })
        ),

    disconnect: (): Promise<void> =>
        new Promise( (resolve, reject) =>
            exec(`"${VPN_EXEC}" disconnect`, (err, stdout) => {
                console.log(stdout);
                console.log('vpn disconnected');
                if (err) reject(err)
                else resolve()
            })
        )
}

export default VPN;