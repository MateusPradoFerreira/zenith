import { Injectable } from "@angular/core";
import { PllRecordState } from "@pollaris";
import { BankAccount } from "../models/bank-account.model";

@Injectable({ providedIn: "root" })
export class BankAccountState extends PllRecordState<BankAccount> {};