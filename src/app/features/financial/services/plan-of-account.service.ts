import { PllPaginatedResponse, PllRestService } from "@pollaris";
import { PlanOfAccount } from "../models/plan-of-account.model";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Injectable } from "@angular/core";

export type GetAllPlanOfAccountByFilterParams = {
  status?: "ACTIVE" | "INACTIVE" | "ALL";
};

@Injectable()
export class PlanOfAccountService extends PllRestService<PlanOfAccount> {
  override baseRoute: string = environment.apiUrl;
  override pathRoute: string = "plan-of-account";

  getAllByFilter({ status }: GetAllPlanOfAccountByFilterParams): Observable<PllPaginatedResponse<PlanOfAccount>> {
    return this.http.get<PllPaginatedResponse<PlanOfAccount>>(`${this.baseRoute}/${this.pathRoute}`, { params: {
      status,
    }});
  };
};