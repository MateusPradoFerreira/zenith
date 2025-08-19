import { Injectable } from "@angular/core";
import { PllRecordMapper } from "@pollaris";
import { CashFlow } from "../models/cash-flow.model";

@Injectable({ providedIn: "root" })
export class CashFlowMapper extends PllRecordMapper<CashFlow> {
  override to(data: CashFlow): CashFlow {
    return data;
  };

  override from(data: CashFlow): CashFlow {
    return data;
  };
};