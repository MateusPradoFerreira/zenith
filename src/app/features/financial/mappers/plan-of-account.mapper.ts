import { Injectable } from "@angular/core";
import { PllRecordMapper } from "@pollaris";
import { PlanOfAccount } from "../models/plan-of-account.model";

@Injectable({ providedIn: "root" })
export class PlanOfAccountMapper extends PllRecordMapper<PlanOfAccount> {
  override to(data: PlanOfAccount): PlanOfAccount {
    return data;
  };

  override from(data: PlanOfAccount): PlanOfAccount {
    return data;
  };
};