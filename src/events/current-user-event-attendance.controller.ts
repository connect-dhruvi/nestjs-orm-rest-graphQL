import { Body, ClassSerializerInterceptor, Controller, DefaultValuePipe, Get, NotFoundException, Param, ParseIntPipe, Put, Query, SerializeOptions, UseGuards, UseInterceptors } from "@nestjs/common";
import { CurrentUser } from "../auth/current-user.decorator";
import { User } from "../auth/user.entity";
import { AttendeesService } from "./attendees.service";
import { EventsService } from "./events.service";
import { CreateAttendeeDto } from "./input/create-attendee.dto";
import { AuthGuardJwt } from './../auth/input/auth-guard.jwt';

@Controller('events-attendance')
@SerializeOptions({ strategy: 'excludeAll' })
export class CurrentUserEventAttendanceController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly attendeesService: AttendeesService
  ) { }

  @Get()
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(
    @CurrentUser() user: User,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1
  ) {
    return await this.eventsService
      .getEventsAttendedByUserIdPaginated(
        user.id, { limit: 6, currentPage: page }
      );
  }

  @Get(':eventId')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(
    @Param('eventId', ParseIntPipe) eventId: number,
    @CurrentUser() user: User
  ) {
    const attendee = await this.attendeesService
      .findOneByEventIdAndUserId(
        eventId, user.id
      );

    if (!attendee) {
      throw new NotFoundException();
    }

    return attendee;
  }

  @Put('/:eventId')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async createOrUpdate(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() input: CreateAttendeeDto,
    @CurrentUser() user: User
  ) {
    return this.attendeesService.createOrUpdate(
      input, eventId, user.id
    );
  }
}

