import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class MainLayoutlState {
  active = signal<boolean>(true);
  hovering = signal<boolean>(false);
};