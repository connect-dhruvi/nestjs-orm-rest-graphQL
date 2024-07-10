import { Body, Controller, Delete, Get, HttpCode, Logger, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateEventDto } from "./input/create-event.dto";
import { Event } from './event.entity';
import { InjectRepository } from "@nestjs/typeorm";
import { Like, MoreThan, Repository } from "typeorm";
import { Attendee } from "./attendee.event";
import { EventsService } from "./events.service";
import { ListEvents, WhenEventFilter } from "./input/list.events";
import { CurrentUser } from "src/auth/current-user.decorator";
import { User } from "src/auth/user.entity";
import { AuthGuardJwt } from "src/auth/input/auth-guard.jwt";


@Controller('/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);
  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
    private readonly eventsService: EventsService
  ) { }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() filter: ListEvents) {
    this.logger.debug(filter);
    this.logger.log('Hit the get all endpoint')
    const events = await this.eventsService.getEventsWithAttendeeCountFilteredPaginated(
      filter,
      {
        total: true,
        currentPage: filter.page,
        limit: 2
      });

    return events;
  }

  @Get('/practice')
  async practice() {
    return await this.repository.find({
      select: ['id', 'name'],
      where: [{
        id: MoreThan(1),
        when: MoreThan(new Date('2021-02-12T02:00:00.000Z'))
      }, { // curly braces represent AND statement
        description: Like('%meet')
      }], // ] is OR statement
      take: 2,// limit in sql
      order: { //order by in sql
        id: 'DESC'
      }
    });
  }


  @Get('/practice2')
  async practice2() {
    // return await this.repository.findOne({
    //   where: { id: 1 },
    //   // loadEagerRelations: false 
    //   relations: ['attendees'], // Specify the relations array correctly
    // });

    const event = await this.repository.findOne({ where: { id: 1 } });
    //this.logger.debug(JSON.stringify(event));
    if (!event) {
      throw new Error('Event not found');
    }

    const attendee = new Attendee();
    attendee.name = "Test Name";
    attendee.event = event;

    await this.attendeeRepository.save(attendee);

    return attendee;

  }


  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id) {

    //  const event = this.events.find(event => event.id === parseInt(id));

    //const event = await this.repository.findOne({ where: { id: id } });
    //if (!event) {
    //  throw new NotFoundException();
    //}

    const event = this.eventsService.getEvent(id);

    //console.log(event)
    return event;
  }

  @Post()
  @UseGuards(AuthGuardJwt)
  async create(
    @Body() input: CreateEventDto,
    @CurrentUser() user: User) {
    return this.eventsService.createEvent(input, user);
  }

  @Patch(':id')
  async update(@Param('id') id,
    @Body()
    input: CreateEventDto) {
    const event = await this.repository.findOne({ where: { id: id } });

    if (!event) {
      throw new NotFoundException();
    }

    return await this.repository.save({

      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when
    });

  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    //this.events = this.events.filter(event => event.id !== parseInt(id));

    // const event = await this.repository.findOne({ where: { id: id } }); // This line expects 'id' to be a selection condition
    // if (!event) {
    //   throw new NotFoundException(`Event with ID ${id} not found`);
    // }

    // await this.repository.remove(event);
    // return { message: `Event with ID ${id} has been deleted` };


    const result = this.eventsService.deleteEvent(id);
    if ((await result)?.affected !== 1) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
  }
}