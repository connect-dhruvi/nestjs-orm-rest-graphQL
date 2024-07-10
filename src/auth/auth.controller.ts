import { Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {

    constructor
        (private readonly authService: AuthService) { }


    @Post('login')
    @UseGuards(AuthGuard('local'))
    async login(@Request() request) {
        return {
            userId: request.user.id,
            token: this.authService.getTokenForUser(request.user)
        }
    }


    // First, you need to do the POST method from before on the "auth/login" route, this will give you the user token. You need to copy it.

    // - Change the method to GET, and change the route to "auth/profile".

    // - Then, you need to go into the "Authorization" tab in your Postman app, and select the "JWT Bearer" type in the select box.

    // - After that, you'll need to fill the "Secret" input with your secret key ("secret123" in this course) and in the "Payload" input write { "token": "THE TOKEN YOU COPIED FROM YOUR USER OBJECT"}
    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    async getProfile(@Request() request) {
        return request.user;
    }
}