import { Injectable } from "@angular/core";
import { PllRecordMapper } from "@pollaris";
import { Receivable } from "../models/receivable.model";

@Injectable({ providedIn: "root" })
export class ReceivableMapper extends PllRecordMapper<Receivable> {
  override to(data: Receivable): Receivable {
    return data;
  };

  override from(data: Receivable): Receivable {
    return data;
  };
};