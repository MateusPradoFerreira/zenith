import { Injectable } from "@angular/core";
import { delay, Observable, of, switchMap, tap, throwError } from "rxjs";
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

    return of(response).pipe(
      delay(500),
      switchMap(response => {
        if(token !== "123") return throwError(() => new Error("Invalid Token!"));
        return of(response);
      }),
    );
  };

  override auth(data: SignInData): Observable<SignInResponse> {
    const response: SignInResponse = {
      id: uuid(),
      name: "Mateus do Prado Ferreira",
      email: "mateuspradoferreira123@gmail.com",
      avatar: "https://i.pinimg.com/736x/5b/0b/47/5b0b4796c743e493be28c55887d92713.jpg",
      token: "123",
    };

    return of(response).pipe(
      delay(500),
      switchMap(response => {
        if(data.email !== response.email) return throwError(() => new Error("Email ou Senha estão Incorretos!"));
        if(data.password !== "123") return throwError(() => new Error("Email ou Senha estão Incorretos!"));
        return of(response);
      }),
    );
  };

  override register(data: SignUpData): Observable<void> {
    return of(null).pipe(
      delay(500),
      switchMap(response => {
        if(data.email === "mateuspradoferreira123@gmail.com") return throwError(() => new Error("Já existe uma conta registrada com este email!"));
        if(data.password !== data.confirmPassword) return throwError(() => new Error("As senhas informadas não coincidem!"));
        return of(response);
      }),
    );
  };
};