export class RegisterDTO {
  username: string;
  password: string;
  email?: string;
  phone?: string;
}

export class LoginDTO {
  username: string;
  password: string;
}
