import { Injectable } from "@angular/core";
import { PllRecordState } from "../../../core/lib/pollaris";
import { Receivable } from "../models/receivable.model";

@Injectable({ providedIn: "root" })
export class ReceivableState extends PllRecordState<Receivable> {};