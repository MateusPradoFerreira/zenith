import { Injectable } from "@angular/core";
import { PllRecordMapper } from "@pollaris";
import { Schedule } from "../models/schedule.model";

@Injectable({ providedIn: "root" })
export class ScheduleMapper extends PllRecordMapper<Schedule> {
  override to(data: Schedule): Schedule {
    return data;
  };

  override from(data: Schedule): Schedule {
    return data;
  };
};