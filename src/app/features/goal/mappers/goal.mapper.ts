import { Injectable } from "@angular/core";
import { PllRecordMapper } from "@pollaris";
import { Goal } from "../models/goal.model";

@Injectable({ providedIn: "root" })
export class GoalMapper extends PllRecordMapper<Goal> {
  override to(data: Goal): Goal {
    return data;
  };

  override from(data: Goal): Goal {
    return data;
  };
};