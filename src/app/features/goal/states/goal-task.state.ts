import { Injectable } from "@angular/core";
import { PllRecordState } from "../../../core/lib/pollaris";
import { GoalTask } from "../models/goal-task.model";

@Injectable({ providedIn: "root" })
export class GoalTaskState extends PllRecordState<GoalTask> {};