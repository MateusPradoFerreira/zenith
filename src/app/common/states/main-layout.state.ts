import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class MainLayoutlState {
  active = signal<boolean>(false);
  hovering = signal<boolean>(false);
};