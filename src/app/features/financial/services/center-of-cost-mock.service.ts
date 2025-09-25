import { PllMockRestService, PllPaginatedResponse, PllRecordRepository, PllRecordState } from "@pollaris";
import { CenterOfCost } from "../models/center-of-cost.model";
import { GetAllCenterOfCostByFilterParams, GetAllCenterOfCostByFilterResponse, CenterOfCostService } from "./center-of-cost.service";
import { delay, Observable } from "rxjs";
import { inject, Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class CenterOfCostMockState extends PllRecordState<CenterOfCost> {};

@Injectable({ providedIn: "root" })
export class CenterOfCostMockRepository extends PllRecordRepository<CenterOfCost> {
  override state = inject(CenterOfCostMockState);
};

@Injectable({ providedIn: "root" })
export class CenterOfCostMockService extends PllMockRestService<CenterOfCost> implements CenterOfCostService {
  override repository = inject(CenterOfCostMockRepository);

  getAllByFilter(params: GetAllCenterOfCostByFilterParams): Observable<PllPaginatedResponse<GetAllCenterOfCostByFilterResponse>> {
    return this.repository.find({
      ...(!params?.status || params.status === "ALL"? {} : { active: params.status === "ACTIVE" }),
    }).pipe(delay(this.delay()));
  };
};