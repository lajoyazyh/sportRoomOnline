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

export class UpdateProfileDTO {
  nickname?: string;
  name?: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  bodyType?: string;
  avatar?: string;
}
