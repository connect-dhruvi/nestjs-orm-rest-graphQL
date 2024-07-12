
import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Subject } from "src/school/subject.entity";
import { Teacher } from "src/school/teacher.entity";
import { Attendee } from "src/events/attendee.entity";
import { Event } from "src/events/event.entity";
import { Profile } from "src/auth/profile.entity";
import { User } from "src/auth/user.entity";


export default registerAs(
    'orm.config',
    (): TypeOrmModuleOptions => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'nestjs-events',//process.env.DB_NAME,
        entities: [Event, Attendee, Subject, Teacher, User, Profile],
        synchronize: true
    })
)