import { Injectable } from "@angular/core";
import { delay, Observable, of } from "rxjs";
import { AuthService } from "../auth.service";
import { SignInData, SignInResponse } from "../../models/sign-in-data.model";
import { SignUpData } from "../../models/sign-up-data.model";
import { v4 as uuid } from 'uuid';

@Injectable({ providedIn: 'root' })
export class AuthMockService extends AuthService {
  override validateAuth(token: string): Observable<SignInResponse>  {
    const response: SignInResponse = {
      id: uuid(),
      name: "Mateus do Prado Ferreira",
      email: "mateuspradoferreira123@gmail.com",
      avatar: "https://i.pinimg.com/736x/5b/0b/47/5b0b4796c743e493be28c55887d92713.jpg",
      token: "123",
    };

    return of(response).pipe(delay(500));
  };

  override auth(data: SignInData): Observable<SignInResponse> {
    const response: SignInResponse = {
      id: uuid(),
      name: "Mateus do Prado Ferreira",
      email: "mateuspradoferreira123@gmail.com",
      avatar: "https://i.pinimg.com/736x/5b/0b/47/5b0b4796c743e493be28c55887d92713.jpg",
      token: "123",
    };

    return of(response).pipe(delay(500));
  };

  override register(data: SignUpData): Observable<void> {
    return of(null);
  };
};