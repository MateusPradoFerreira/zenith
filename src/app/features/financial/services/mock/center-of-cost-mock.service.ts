import { PllMockRestService, PllPaginatedResponse, PllRecordRepository, PllRecordState } from "@pollaris";
import { CenterOfCost } from "../../models/center-of-cost.model";
import { CenterOfCostViewParams, CenterOfCostService } from "../center-of-cost.service";
import { delay, Observable } from "rxjs";
import { inject, Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class CenterOfCostMockState extends PllRecordState<CenterOfCost> {};

@Injectable({ providedIn: "root" })
export class CenterOfCostMockRepository extends PllRecordRepository<CenterOfCost> {
  override state = inject(CenterOfCostMockState);
};

export class CenterOfCostMockService extends PllMockRestService<CenterOfCost> implements CenterOfCostService {
  override repository = inject(CenterOfCostMockRepository);

  getAllByFilter(params: CenterOfCostViewParams): Observable<PllPaginatedResponse<CenterOfCost>> {
    return this.repository.$find({
      active: !params.status || params.status === "ALL"? undefined : params.status === "ACTIVE"? true : false,
    }).pipe(delay(this.delay()));
  };
};