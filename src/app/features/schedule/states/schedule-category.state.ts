import { Injectable } from "@angular/core";
import { PllRecordState } from "../../../core/lib/pollaris";
import { ScheduleCategory } from "../models/schedule-category.model";

@Injectable({ providedIn: "root" })
export class ScheduleCategoryState extends PllRecordState<ScheduleCategory> {};