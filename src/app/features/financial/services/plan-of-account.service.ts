import { PllPaginatedResponse, PllRestService } from "@pollaris";
import { PlanOfAccount } from "../models/plan-of-account.model";
import { map, Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Injectable } from "@angular/core";

export type PlanOfAccountViewParams = {
  status?: "ACTIVE" | "INACTIVE" | "ALL";
};

@Injectable()
export class PlanOfAccountService extends PllRestService<PlanOfAccount> {
  override baseRoute: string = environment.apiUrl;
  override pathRoute: string = "plans-of-account";

  getAllByFilter({ status }: PlanOfAccountViewParams): Observable<PllPaginatedResponse<PlanOfAccount>> {
    return this.http.get<PlanOfAccount[]>(`${this.baseRoute}/${this.pathRoute}`, { params: {
      status,
    }}).pipe(map(response => ({ data: response, pagination: { page: 1, size: 100, sort: "ASC", total: response.length }})));
  };
};