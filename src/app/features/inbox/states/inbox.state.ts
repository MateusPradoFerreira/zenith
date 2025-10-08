import { Injectable } from "@angular/core";
import { PllRecordState } from "@pollaris";
import { Inbox } from "../models/inbox.model";

@Injectable({ providedIn: "root" })
export class InboxState extends PllRecordState<Inbox> {};