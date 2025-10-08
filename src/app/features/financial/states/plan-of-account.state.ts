import { Injectable } from "@angular/core";
import { PllRecordState } from "@pollaris";
import { PlanOfAccount } from "../models/plan-of-account.model";

@Injectable({ providedIn: "root" })
export class PlanOfAccountState extends PllRecordState<PlanOfAccount> {};