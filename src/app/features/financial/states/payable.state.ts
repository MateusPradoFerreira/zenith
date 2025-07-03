import { Injectable } from "@angular/core";
import { PllRecordState } from "../../../core/lib/pollaris";
import { Payable } from "../models/payable.model";

@Injectable({ providedIn: "root" })
export class PayableState extends PllRecordState<Payable> {};