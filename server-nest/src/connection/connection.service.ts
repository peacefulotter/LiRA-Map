import { Injectable } from '@nestjs/common';
import { InjectConnection, Knex } from 'nestjs-knex';

@Injectable()
export class ConnectionService {
    constructor(@InjectConnection('lira-main') private readonly knex: Knex) {}

    async getConnection(): Promise<boolean> {
        try {
            await this.knex.raw('select 1+1 as result')
        } catch(error) {
            console.error("Could not connect to DB: ", error)

            return false
            //await new Promise(res => setTimeout(res, 5000))
        }

        return true
    }
}
