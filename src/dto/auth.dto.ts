import { CreateUserDto } from "./user.dto";

export class SignupDto extends CreateUserDto { }

export class LoginDto {
    email: string;
    password: string
}