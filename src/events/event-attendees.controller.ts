import { Controller, Get, Param, SerializeOptions } from "@nestjs/common";
import { AttendeeService } from "./attendee.service";

@Controller('events/:eventId/attendess')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventAttendeesController {

    constructor(
        private readonly attendeesService: AttendeeService
    ) { }

    @Get()
    async findAll(@Param('eventId') eventId: number) {
        return await this.attendeesService.findEventById(eventId);
    }
}