import { Injectable } from "@angular/core";
import { PllRecordState } from "../../../core/lib/pollaris";
import { GoalItem } from "../models/goal-item.model";

@Injectable({ providedIn: "root" })
export class GoalItemState extends PllRecordState<GoalItem> {};