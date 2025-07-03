import { Injectable } from "@angular/core";
import { PllRecordState } from "../../../core/lib/pollaris";
import { Secrecy } from "../models/secrecy.model";

@Injectable({ providedIn: "root" })
export class SecrecyState extends PllRecordState<Secrecy> {};