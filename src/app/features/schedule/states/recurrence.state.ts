import { Injectable } from "@angular/core";
import { PllRecordState } from "../../../core/lib/pollaris";
import { Recurrence } from "../models/recurrence.model";

@Injectable({ providedIn: "root" })
export class RecurrenceState extends PllRecordState<Recurrence> {};