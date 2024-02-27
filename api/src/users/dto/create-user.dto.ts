export class CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  isActive: boolean;
  verificationCode: number;
}
