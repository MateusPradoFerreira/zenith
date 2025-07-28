import { Injectable } from "@angular/core";
import { PllRecordMapper } from "@pollaris";
import { ScheduleCategory } from "../models/schedule-category.model";

@Injectable({ providedIn: "root" })
export class ScheduleCategoryMapper extends PllRecordMapper<ScheduleCategory> {
  override to(data: ScheduleCategory): ScheduleCategory {
    return data;
  };

  override from(data: ScheduleCategory): ScheduleCategory {
    return data;
  };
};