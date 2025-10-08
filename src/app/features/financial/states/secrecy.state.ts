import { Injectable } from "@angular/core";
import { PllRecordState } from "@pollaris";
import { Secrecy } from "../models/secrecy.model";

@Injectable({ providedIn: "root" })
export class SecrecyState extends PllRecordState<Secrecy> {};