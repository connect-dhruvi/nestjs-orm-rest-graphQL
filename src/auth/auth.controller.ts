import { ClassSerializerInterceptor, Controller, Get, Post, Request, SerializeOptions, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./current-user.decorator";
import { User } from "./user.entity";
import { AuthGuardLocal } from "./input/auth-guard.local";
import { AuthGuardJwt } from "./input/auth-guard.jwt";

@Controller('auth')
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {

    constructor
        (private readonly authService: AuthService) { }


    @Post('login')
    @UseGuards(AuthGuardLocal)
    async login(@CurrentUser() user: User) {
        return {
            userId: user.id,
            token: this.authService.getTokenForUser(user)
        }
    }


    // First, you need to do the POST method from before on the "auth/login" route, this will give you the user token. You need to copy it.

    // - Change the method to GET, and change the route to "auth/profile".

    // - Then, you need to go into the "Authorization" tab in your Postman app, and select the "JWT Bearer" type in the select box.

    // - After that, you'll need to fill the "Secret" input with your secret key ("secret123" in this course) and in the "Payload" input write { "token": "THE TOKEN YOU COPIED FROM YOUR USER OBJECT"}
    @Get('profile')
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async getProfile(@CurrentUser() user) {
        return user;
    }


}