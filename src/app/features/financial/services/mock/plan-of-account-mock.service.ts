import { PllMockRestService, PllPaginatedResponse, PllRecordRepository, PllRecordState } from "@pollaris";
import { PlanOfAccount } from "../../models/plan-of-account.model";
import { PlanOfAccountViewParams, PlanOfAccountService } from "../plan-of-account.service";
import { delay, Observable } from "rxjs";
import { inject, Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class PlanOfAccountMockState extends PllRecordState<PlanOfAccount> {};

@Injectable({ providedIn: "root" })
export class PlanOfAccountMockRepository extends PllRecordRepository<PlanOfAccount> {
  override state = inject(PlanOfAccountMockState);
};

export class PlanOfAccountMockService extends PllMockRestService<PlanOfAccount> implements PlanOfAccountService {
  override repository = inject(PlanOfAccountMockRepository);

  getAllByFilter(params: PlanOfAccountViewParams): Observable<PllPaginatedResponse<PlanOfAccount>> {
    return this.repository.$find({
      active: !params.status || params.status === "ALL"? undefined : params.status === "ACTIVE"? true : false,
    }).pipe(delay(this.delay()));
  };
};