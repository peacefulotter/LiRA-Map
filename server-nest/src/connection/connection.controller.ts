import {Controller, Get} from "@nestjs/common";
import {ConnectionService} from "./connection.service";

@Controller('connection')
export class ConnectionController {
    constructor(private readonly service: ConnectionService) {
    }

    @Get('/')
    getConnection(): Promise<boolean> {
        return this.service.getConnection();
    }
}