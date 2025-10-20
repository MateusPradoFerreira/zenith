import { computed, Injectable, signal } from "@angular/core";
import { UserData } from "../models/user-data.model";

@Injectable({ providedIn: 'root' })
export class AuthState {
  userData = signal<UserData>(null);
  userToken = signal<string>(null);
  isLoggedIn = computed<boolean>(() => !!this.userToken());
};