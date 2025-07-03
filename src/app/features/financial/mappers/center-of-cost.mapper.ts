import { Injectable } from "@angular/core";
import { PllRecordMapper } from "@pollaris";
import { CenterOfCost } from "../models/center-of-cost.model";

@Injectable({ providedIn: "root" })
export class CenterOfCostMapper extends PllRecordMapper<CenterOfCost> {
  override to(data: CenterOfCost): CenterOfCost {
    return data;
  };

  override from(data: CenterOfCost): CenterOfCost {
    return data;
  };
};