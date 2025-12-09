import { PllPaginatedResponse, PllRestService } from "@pollaris";
import { ScheduleCategory, ScheduleCategoryType } from "../models/schedule-category.model";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Injectable } from "@angular/core";

export type ScheduleCategoryViewParams = {
  status?: "ACTIVE" | "INACTIVE" | "ALL";
  type?: ScheduleCategoryType | "ALL";
};

@Injectable()
export class ScheduleCategoryService extends PllRestService<ScheduleCategory> {
  override baseRoute: string = environment.apiUrl;
  override pathRoute: string = "schedule-categories";

  getAllByFilter(params: ScheduleCategoryViewParams): Observable<PllPaginatedResponse<ScheduleCategory>> {
    return this.http.get<PllPaginatedResponse<ScheduleCategory>>(`${this.baseRoute}/${this.pathRoute}`, { params });
  };
};