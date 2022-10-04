import { Injectable } from '@nestjs/common';
import { InjectConnection, Knex } from 'nestjs-knex';

@Injectable()
export class ConnectionService {
    constructor(@InjectConnection('postgis') private readonly knex: Knex) {}

    async getConnection(retries = 3): Promise<boolean> {
        while (retries) {
            try {
                await this.knex.raw('select 1+1 as result')
                break
            } catch(error) {
            console.error("Could not connect to DB: ", error)

            retries -= 1
            await new Promise(res => setTimeout(res, 5000))
            }
        }

        return retries > 0
    }
}
