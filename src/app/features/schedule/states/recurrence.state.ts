import { Injectable } from "@angular/core";
import { PllRecordState } from "@pollaris";
import { Recurrence } from "../models/recurrence.model";

@Injectable({ providedIn: "root" })
export class RecurrenceState extends PllRecordState<Recurrence> {};