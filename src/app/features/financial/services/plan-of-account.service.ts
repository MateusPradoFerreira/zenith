import { Observable } from "rxjs";
import { BaseService } from "../../../core/base/base-service";
import { PlanOfAccount } from "../models/plan-of-account.model";
import { environment } from "../../../../environments/environment";
import { Injectable } from "@angular/core";

export type GetAllPlanOfAccountByFilterParams = {
  status: "ALL" | "ACTIVE" | "INACTIVE";
};

@Injectable()
export class PlanOfAccountService extends BaseService<PlanOfAccount> {
  route: string = "planOfAccount";

  getAllByFilter({ status }: GetAllPlanOfAccountByFilterParams): Observable<PlanOfAccount[]> {
    return this.http.get(`${environment.apiUrl}/${this.route}/status/${status}`) as Observable<PlanOfAccount[]>;
  };
};