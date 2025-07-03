import { Injectable } from "@angular/core";
import { PllRecordState } from "../../../core/lib/pollaris";
import { CenterOfCost } from "../models/center-of-cost.model";

@Injectable({ providedIn: "root" })
export class CenterOfCostState extends PllRecordState<CenterOfCost> {};