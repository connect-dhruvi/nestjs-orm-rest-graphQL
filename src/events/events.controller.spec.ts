import { EventsService } from "./events.service";
import { EventsController } from './events.controller';
import { Repository } from "typeorm";
import { Event } from "./event.entity";
import { ListEvents } from "./input/list.events";
import { NotFoundException } from "@nestjs/common";
import { User } from "../auth/user.entity";

describe('EventsController', () => {
    let eventsService: EventsService;
    let eventsController: EventsController;
    let eventsRepository: Repository<Event>;

    beforeAll(() => console.log('This is logged once'));

    beforeEach(() => {
        console.log('Called everytime test is run inside this group');
        eventsService = new EventsService(eventsRepository);
        eventsController = new EventsController(eventsService);
    });

    it('should rturn list of  events', async () => {
        const result = {
            first: 1,
            last: 1,
            limit: 5,
            data: []
        };

        // eventsService.getEventsWithAttendeeCountFilteredPaginated
        //     = jest.fn().mockImplementation((): any => result);

            const spy = jest.spyOn(eventsService, 'getEventsWithAttendeeCountFilteredPaginated')
            .mockImplementation(() :  any => result);

        expect(await eventsController.findAll(new ListEvents))
            .toEqual(result);
            expect(spy).toBeCalledTimes(1);

    });


    it('should not delete an event, when it\'s not found', async () => {
        const deleteSpy = jest.spyOn(eventsService, 'deleteEvent');
        const findSpy = jest.spyOn(eventsService, 'findOne')
          .mockImplementation((): any => undefined);
    
        try {
          await eventsController.remove(1, new User());
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
    
        expect(deleteSpy).toBeCalledTimes(0);
        expect(findSpy).toBeCalledTimes(1);
      });
    });