import { PllPaginatedResponse, PllRestService } from "@pollaris";
import { PlanOfAccount } from "../models/plan-of-account.model";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Injectable } from "@angular/core";

export type GetAllPlanOfAccountByFilterParams = {
  status?: "ACTIVE" | "INACTIVE" | "ALL";
};

export type GetAllPlanOfAccountByFilterResponse = PlanOfAccount;

@Injectable()
export class PlanOfAccountService extends PllRestService<PlanOfAccount> {
  override baseRoute: string = environment.apiUrl;
  override pathRoute: string = "secrecy";

  getAllByFilter({ status }: GetAllPlanOfAccountByFilterParams): Observable<PllPaginatedResponse<GetAllPlanOfAccountByFilterResponse>> {
    return this.http.get<PllPaginatedResponse<GetAllPlanOfAccountByFilterResponse>>(`${this.baseRoute}/${this.pathRoute}`, { params: {
      status,
    }});
  };
};