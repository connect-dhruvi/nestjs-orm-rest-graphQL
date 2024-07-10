import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Attendee } from "./attendee.event";

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  when: Date;

  @Column({ nullable: true })
  address: string;

  @OneToMany(() => Attendee, (attendee) => attendee.event,
    // {
    //   eager: true
    // }
  )
  attendees: Attendee[];

  attendeeCount?: number;
  attendeeRejected?: number;
  attendeeMaybe?: number;
  attendeeAccepted?: number;
}