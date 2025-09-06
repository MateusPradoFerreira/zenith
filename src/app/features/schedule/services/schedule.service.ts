import { PllID, PllPaginatedResponse, PllRestService } from "@pollaris";
import { Schedule } from "../models/schedule.model";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import moment from "moment";
import { Injectable } from "@angular/core";
import { Colors } from "../../../common/types/colors.type";
import { ScheduleCategoryType } from "../models/schedule-category.model";

export type GetAllScheduleByFilterParams = {
  categoryIds?: PllID[];
  startsAt: Date;
  endsAt: Date;
};

export type GetAllScheduleByFilterResponse = Schedule & {
  category: string;
  type: ScheduleCategoryType;
  color: Colors;
};

@Injectable()
export class ScheduleService extends PllRestService<Schedule> {
  override baseRoute: string = environment.apiUrl;
  override pathRoute: string = "schedule";

  getAllByFilter({ startsAt, endsAt, categoryIds }: GetAllScheduleByFilterParams): Observable<PllPaginatedResponse<GetAllScheduleByFilterResponse>> {
    return this.http.get<PllPaginatedResponse<GetAllScheduleByFilterResponse>>(`${this.baseRoute}/${this.pathRoute}`, { params: {
      categoryIds: categoryIds? categoryIds.join(",") : "",
      startsAt: moment(startsAt).format("YYYY-MM-DD"),
      endsAt: moment(endsAt).format("YYYY-MM-DD"),
    }});
  };
};