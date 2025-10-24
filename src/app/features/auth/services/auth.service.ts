import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SignInData, SignInResponse } from "../models/sign-in-data.model";
import { environment } from "../../../../environments/environment";
import { SignUpData } from "../models/sign-up-data.model";

export class AuthService {
  http = inject(HttpClient);

  baseRoute: string = environment.apiUrl;
  pathRoute: string = "auth";

  validateAuth(token: string): Observable<SignInResponse>  {
    return this.http.post<SignInResponse>(`${this.baseRoute}/${this.pathRoute}/validate-auth`, { token });
  };

  auth(data: SignInData): Observable<SignInResponse> {
    return this.http.post<SignInResponse>(`${this.baseRoute}/${this.pathRoute}/auth`, data);
  };

  register(data: SignUpData): Observable<void> {
    return this.http.post<void>(`${this.baseRoute}/${this.pathRoute}/register`, data);
  };
};