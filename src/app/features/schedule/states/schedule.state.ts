import { Injectable } from "@angular/core";
import { PllRecordState } from "@pollaris";
import { Schedule } from "../models/schedule.model";

@Injectable({ providedIn: "root" })
export class ScheduleState extends PllRecordState<Schedule> {};