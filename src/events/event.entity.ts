import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Attendee } from "./attendee.event";
import { User } from "src/auth/user.entity";
import { Expose } from "class-transformer";

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column()
  @Expose()
  name: string;

  @Column({ nullable: true })
  @Expose()
  description: string;

  @Column({ nullable: true })
  @Expose()
  when: Date;

  @Column({ nullable: true })
  @Expose()
  address: string;

  @OneToMany(() => Attendee, (attendee) => attendee.event,
    // {
    //   eager: true
    // }
  )
  attendees: Attendee[];

  @ManyToOne(() => User, (user) => user.organized)
  @JoinColumn({ name: 'organizerId' })
  organizer: User;

  @Expose()
  @Column({ nullable: true })
  organizerId: number;

  attendeeCount?: number;
  attendeeRejected?: number;
  attendeeMaybe?: number;
  attendeeAccepted?: number;
}