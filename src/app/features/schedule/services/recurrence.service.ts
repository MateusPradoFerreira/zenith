import { PllRestService } from "@pollaris";
import { Recurrence } from "../models/recurrence.model";
import { environment } from "../../../../environments/environment";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class RecurrenceService extends PllRestService<Recurrence> {
  override baseRoute: string = environment.apiUrl;
  override pathRoute: string = "recurrences";

  generateOne(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseRoute}/${this.pathRoute}/${id}/generate`, {});
  };
};