import { Injectable } from "@angular/core";
import { PllRecordMapper } from "@pollaris";
import { Secrecy } from "../models/secrecy.model";

@Injectable({ providedIn: "root" })
export class SecrecyMapper extends PllRecordMapper<Secrecy> {
  override to(data: Secrecy): Secrecy {
    return data;
  };

  override from(data: Secrecy): Secrecy {
    return data;
  };
};