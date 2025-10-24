import { inject, Injectable } from "@angular/core";
import { AuthState } from "../states/auth.state";
import { AuthService } from "../services/auth.service";
import { SignInData, SignInResponse } from "../models/sign-in-data.model";
import { delay, lastValueFrom, Observable, of, tap } from "rxjs";
import { PllFormSchemaConfig } from "@pollaris/forms";
import { Validators } from "@angular/forms";
import { SignUpData } from "../models/sign-up-data.model";
import { Refiners } from "@pollaris/forms/refiners";
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  state = inject(AuthState);
  service = inject(AuthService);
  router = inject(Router);

  signInSchema: PllFormSchemaConfig<SignInData> = {
    fields: {
      email: { value: null, validators: [Validators.required, Validators.email] },
      password: { value: null, validators: [Validators.required] },
    },
  };

  signUpSchema: PllFormSchemaConfig<SignUpData> = {
    fields: {
      name: { value: null, validators: [Validators.required], refiners: [Refiners.trim] },
      email: { value: null, validators: [Validators.required, Validators.email] },
      password: { value: null, validators: [Validators.required] },
      confirmPassword: { value: null, validators: [Validators.required] },
    },
  };

  async validateAuth() {
    console.log("VALIDATE-AUTH");
    const token = window.localStorage.getItem("user-token");

    if(!token) {
      this.signOut();
      return;
    };

    const $req = this.service.validateAuth(token).pipe(
      tap(response => window.localStorage.setItem("user-token", response.token)),
      tap(response => this.state.userToken.set(response.token)),
      tap(response => this.state.userData.set(response)),
    );

    await lastValueFrom($req).then(() => console.log("VALID-USER-SESSION")).catch(() => this.signOut());
  };

  signIn(data: SignInData): Observable<SignInResponse> {
    this.clearAuthData();
    return this.service.auth(data).pipe(
      tap(response => window.localStorage.setItem("user-token", response.token)),
      tap(response => this.state.userToken.set(response.token)),
      tap(response => this.state.userData.set(response)),
    );
  };

  signOut() {
    this.clearAuthData();
    this.router.navigate(["/auth/sign-in"]);
  };

  clearAuthData() {
    window.localStorage.removeItem("user-token");
    this.state.userToken.set(null);
    this.state.userData.set(null);
  };
};