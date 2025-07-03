import { Injectable, signal, WritableSignal } from "@angular/core";
import { PllID } from "../../core/lib/pollaris";

export type UserData = {
  id: PllID;
  name: string;
  email: string;
  avatar: string;
};

@Injectable({ providedIn: 'root' })
export class AuthState {
  userData: WritableSignal<UserData> = signal({
    id: null,
    name: "Mateus do Prado",
    email: "mateuspradoferreira123@gmail.com",
    avatar: "https://i.pinimg.com/736x/49/5f/50/495f505257d65c459710135eb817d63f.jpg",
  });
};