import { ClassSerializerInterceptor, Controller, Get, Param, Query, SerializeOptions, UseInterceptors } from "@nestjs/common";
import { Repository } from "typeorm";
import { EventsService } from "./events.service";

@Controller('events-organized-by-user/:userId')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventsOrganizedByUserController {
    constructor(
        private readonly eventsService: EventsService
    ) {

    }

    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    public async findAll(
        @Param('userId') userId: number,
        @Query('page') page = 1) {
        return this.eventsService.
            getEventsOrganizedByUserIdPaginated(
                userId,
                { currentPage: page, limit: 5 }
            )
    }
}