import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable } from "rxjs";
import { SignInData, SignInResponse } from "../models/sign-in-data.model";
import { environment } from "../../../../environments/environment";
import { SignUpData } from "../models/sign-up-data.model";

export class AuthService {
  http = inject(HttpClient);

  baseRoute: string = environment.apiUrl;
  pathRoute: string = "auth";

  auth(data: SignInData): Observable<SignInResponse> {
    return this.http.post<SignInResponse>(`${this.baseRoute}/${this.pathRoute}/sign-in`, data);
  };

  register(data: SignUpData): Observable<SignInResponse> {
    return this.http.post<SignInResponse>(`${this.baseRoute}/${this.pathRoute}/sign-up`, data);
  };

  validateAuth(token: string): Observable<SignInResponse>  {
    return this.http.post<SignInResponse>(`${this.baseRoute}/${this.pathRoute}/validate-auth`, { token });
  };
};