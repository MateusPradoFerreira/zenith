import { Injectable } from "@angular/core";
import { PllRecordState } from "../../../core/lib/pollaris";
import { Goal } from "../models/goal.model";

@Injectable({ providedIn: "root" })
export class GoalState extends PllRecordState<Goal> {};