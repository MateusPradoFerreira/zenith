import { PllRestService } from "@pollaris";
import { Recurrence } from "../models/recurrence.model";
import { environment } from "../../../../environments/environment";
import { Injectable } from "@angular/core";

@Injectable()
export class RecurrenceService extends PllRestService<Recurrence> {
  override baseRoute: string = environment.apiUrl;
  override pathRoute: string = "schedule";
};