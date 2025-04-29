import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class MainLayoutlState {
  private active = new BehaviorSubject<boolean>(true);
  active$ = this.active.asObservable();
  setActive = (data: boolean) => this.active.next(data);

  private hovering = new BehaviorSubject<boolean>(false);
  hovering$ = this.hovering.asObservable();
  setHovering = (data: boolean) => this.hovering.next(data);
};