import { PllID, PllPaginatedResponse, PllRestService } from "@pollaris";
import { Schedule } from "../models/schedule.model";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import moment from "moment";
import { Injectable } from "@angular/core";
import { Colors } from "../../../common/types/colors.type";
import { ScheduleCategoryType } from "../models/schedule-category.model";

export type ScheduleViewParams = {
  categoryIds?: PllID[];
  startsAt: Date;
  endsAt: Date;
};

export type ScheduleViewResponse = Schedule & {
  category: string;
  type: ScheduleCategoryType;
  color: Colors;
};

@Injectable()
export class ScheduleService extends PllRestService<Schedule> {
  override baseRoute: string = environment.apiUrl;
  override pathRoute: string = "schedule";

  getAllByFilter({ startsAt, endsAt, categoryIds }: ScheduleViewParams): Observable<PllPaginatedResponse<ScheduleViewResponse>> {
    return this.http.get<PllPaginatedResponse<ScheduleViewResponse>>(`${this.baseRoute}/${this.pathRoute}/startsAt/${moment(startsAt).format("YYYY-MM-DD")}/endsAt/${moment(endsAt).format("YYYY-MM-DD")}`, { params: {
      categoryIds: categoryIds? categoryIds.join(",") : "",
    }});
  };
};