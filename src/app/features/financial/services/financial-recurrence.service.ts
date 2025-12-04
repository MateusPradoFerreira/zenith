import { PllPaginatedResponse, PllRestService } from "@pollaris";
import { FinancialRecurrence } from "../models/financial-recurrence.model";
import { map, Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Injectable } from "@angular/core";

export type FinancialRecurrenceViewParams = {
  status?: "ACTIVE" | "INACTIVE" | "ALL";
};

@Injectable()
export class FinancialRecurrenceService extends PllRestService<FinancialRecurrence> {
  override baseRoute: string = environment.apiUrl;
  override pathRoute: string = "financial-recurrences";

  getAllByFilter({ status }: FinancialRecurrenceViewParams): Observable<PllPaginatedResponse<FinancialRecurrence>> {
    return this.http.get<FinancialRecurrence[]>(`${this.baseRoute}/${this.pathRoute}`, { params: {
      status,
    }}).pipe(map(response => ({ data: response, pagination: { page: 1, size: 100, sort: "ASC", total: response.length }})));
  };
};