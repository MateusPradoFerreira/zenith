import { PllMockRestService, PllPaginatedResponse, PllRecordRepository, PllRecordState } from "@pollaris";
import { PlanOfAccount } from "../models/plan-of-account.model";
import { GetAllPlanOfAccountByFilterParams, GetAllPlanOfAccountByFilterResponse, PlanOfAccountService } from "./plan-of-account.service";
import { delay, Observable } from "rxjs";
import { inject, Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class PlanOfAccountMockState extends PllRecordState<PlanOfAccount> {};

@Injectable({ providedIn: "root" })
export class PlanOfAccountMockRepository extends PllRecordRepository<PlanOfAccount> {
  override state = inject(PlanOfAccountMockState);
};

@Injectable({ providedIn: "root" })
export class PlanOfAccountMockService extends PllMockRestService<PlanOfAccount> implements PlanOfAccountService {
  override repository = inject(PlanOfAccountMockRepository);

  getAllByFilter(params: GetAllPlanOfAccountByFilterParams): Observable<PllPaginatedResponse<GetAllPlanOfAccountByFilterResponse>> {
    return this.repository.find({
      ...(!params?.status || params.status === "ALL"? {} : { active: params.status === "ACTIVE" }),
    }).pipe(delay(this.delay()));
  };
};