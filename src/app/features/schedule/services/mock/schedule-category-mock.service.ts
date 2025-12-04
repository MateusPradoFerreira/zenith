import { PllMockRestService, PllPaginatedResponse, PllRecordRepository, PllRecordState } from "@pollaris";
import { ScheduleCategory } from "../../models/schedule-category.model";
import { ScheduleCategoryViewParams, ScheduleCategoryService } from "../schedule-category.service";
import { delay, Observable } from "rxjs";
import { inject, Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class ScheduleCategoryMockState extends PllRecordState<ScheduleCategory> {};

@Injectable({ providedIn: "root" })
export class ScheduleCategoryMockRepository extends PllRecordRepository<ScheduleCategory> {
  override state = inject(ScheduleCategoryMockState);
};

export class ScheduleCategoryMockService extends PllMockRestService<ScheduleCategory> implements ScheduleCategoryService {
  override repository = inject(ScheduleCategoryMockRepository);

  getAllByFilter(params: ScheduleCategoryViewParams): Observable<PllPaginatedResponse<ScheduleCategory>> {
    return this.repository.$find({
      active: !params.status || params.status === "ALL"? undefined : params.status === "ACTIVE"? true : false,
      type: !params.type || params.type === "ALL"? undefined : params.type,
    }).pipe(delay(this.delay()));
  };
};