import { inject, Injectable } from "@angular/core";
import { AuthState } from "../states/auth.state";
import { AuthService } from "../services/auth.service";
import { SignInData, SignInResponse } from "../models/sign-in-data.model";
import { lastValueFrom, Observable, tap } from "rxjs";
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

  defaultAvatar: string = "https://i.pinimg.com/736x/88/d0/c6/88d0c6df5a9ce8a683a397cce2e5ab94.jpg";

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
      this.clearAuthData();
      return;
    };

    const $req = this.service.validateAuth(token).pipe(
      tap(response => window.localStorage.setItem("user-token", response.token)),
      tap(response => this.state.userToken.set(response.token)),
      tap(({ token, ...response}) => this.state.userData.set({ ...response, avatar: response.avatar || this.defaultAvatar })),
    );

    await lastValueFrom($req).then(() => console.log("VALID-USER-SESSION")).catch(() => this.signOut());
  };

  signIn(data: SignInData): Observable<SignInResponse> {
    this.clearAuthData();
    return this.service.auth(data).pipe(
      tap(response => window.localStorage.setItem("user-token", response.token)),
      tap(response => this.state.userToken.set(response.token)),
      tap(({ token, ...response}) => this.state.userData.set({ ...response, avatar: response.avatar || this.defaultAvatar })),
    );
  };

  signUp(data: SignUpData): Observable<SignInResponse> {
    return this.service.register(data).pipe(
      tap(response => window.localStorage.setItem("user-token", response.token)),
      tap(response => this.state.userToken.set(response.token)),
      tap(({ token, ...response}) => this.state.userData.set({ ...response, avatar: response.avatar || this.defaultAvatar })),
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