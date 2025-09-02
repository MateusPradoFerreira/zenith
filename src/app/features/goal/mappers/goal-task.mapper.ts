import { Injectable } from "@angular/core";
import { PllRecordMapper } from "@pollaris";
import { GoalTask } from "../models/goal-task.model";

@Injectable({ providedIn: "root" })
export class GoalTaskMapper extends PllRecordMapper<GoalTask> {
  override to(data: GoalTask): GoalTask {
    return data;
  };

  override from(data: GoalTask): GoalTask {
    return data;
  };
};