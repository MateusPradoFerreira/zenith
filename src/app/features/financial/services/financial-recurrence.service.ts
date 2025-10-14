import { PllPaginatedResponse, PllRestService } from "@pollaris";
import { FinancialRecurrence } from "../models/financial-recurrence.model";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Injectable } from "@angular/core";

export type GetAllFinancialRecurrenceByFilterParams = {
  status?: "ACTIVE" | "INACTIVE" | "ALL";
};

@Injectable()
export class FinancialRecurrenceService extends PllRestService<FinancialRecurrence> {
  override baseRoute: string = environment.apiUrl;
  override pathRoute: string = "secrecy";

  getAllByFilter({ status }: GetAllFinancialRecurrenceByFilterParams): Observable<PllPaginatedResponse<FinancialRecurrence>> {
    return this.http.get<PllPaginatedResponse<FinancialRecurrence>>(`${this.baseRoute}/${this.pathRoute}`, { params: {
      status,
    }});
  };
};