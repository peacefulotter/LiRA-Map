import { Injectable } from '@nestjs/common';
import { InjectConnection, Knex } from 'nestjs-knex';

@Injectable()
export class ConnectionService {
    constructor(@InjectConnection('lira-main') private readonly knex: Knex) {}

    async getConnection(): Promise<boolean> {
        try {
            await this.knex.raw('select 1+1 as result')
        } catch (error) {
            console.error("Could not connect to DB: ", error)

            return false
        }

        return true

        /*
        const a = new Promise((resolve: (value: boolean) => void, reject) => {
            setTimeout(async () => {
                try {
                    await this.knex.raw('select 1+1 as result')
                } catch (error) {
                    console.error("Could not connect to DB: ", error)

                    resolve(false)
                }
                resolve(true);
            }, 3000);
            resolve(false);
        });

        return await Promise.race([a]);
        */
    }
}
