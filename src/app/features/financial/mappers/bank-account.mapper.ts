import { Injectable } from "@angular/core";
import { PllRecordMapper } from "@pollaris";
import { BankAccount } from "../models/bank-account.model";

@Injectable({ providedIn: "root" })
export class BankAccountMapper extends PllRecordMapper<BankAccount> {
  override to(data: BankAccount): BankAccount {
    return data;
  };

  override from(data: BankAccount): BankAccount {
    return data;
  };
};