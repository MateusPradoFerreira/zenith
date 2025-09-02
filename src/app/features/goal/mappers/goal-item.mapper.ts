import { Injectable } from "@angular/core";
import { PllRecordMapper } from "@pollaris";
import { GoalItem } from "../models/goal-item.model";

@Injectable({ providedIn: "root" })
export class GoalItemMapper extends PllRecordMapper<GoalItem> {
  override to(data: GoalItem): GoalItem {
    return data;
  };

  override from(data: GoalItem): GoalItem {
    return data;
  };
};