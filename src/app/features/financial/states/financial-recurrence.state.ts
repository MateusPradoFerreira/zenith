import { Injectable } from "@angular/core";
import { PllRecordState } from "@pollaris";
import { FinancialRecurrence } from "../models/financial-recurrence.model";

@Injectable({ providedIn: "root" })
export class FinancialRecurrenceState extends PllRecordState<FinancialRecurrence> {};