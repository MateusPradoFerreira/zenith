import { UserData } from "./user-data.model";

export class SignInData {
  email: string;
  password: string;
};

export class SignInResponse extends UserData {
  token: string;
};