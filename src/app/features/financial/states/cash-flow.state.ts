import { Injectable } from "@angular/core";
import { PllRecordState } from "../../../core/lib/pollaris";
import { CashFlow } from "../models/cash-flow.model";

@Injectable({ providedIn: "root" })
export class CashFlowState extends PllRecordState<CashFlow> {};