import { Injectable } from "@angular/core";
import { PllRecordMapper } from "@pollaris";
import { Payable } from "../models/payable.model";

@Injectable({ providedIn: "root" })
export class PayableMapper extends PllRecordMapper<Payable> {
  override to(data: Payable): Payable {
    return data;
  };

  override from(data: Payable): Payable {
    return data;
  };
};