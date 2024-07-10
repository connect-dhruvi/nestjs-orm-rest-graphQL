import { Length, IsDateString, IsString } from "class-validator";

export class CreateEventDto {


  @IsString()
  @Length(5, 255, { message: "The length of name provided must be between 5 to 255 characters" })
  name: string;

  @Length(5, 255)
  description: string;

  @IsDateString()
  when: string;

  @Length(5, 255)

  address: string;
}