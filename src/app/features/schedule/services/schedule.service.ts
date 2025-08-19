import { PllPaginatedResponse, PllRestService } from "@pollaris";
import { Schedule } from "../models/schedule.model";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import moment from "moment";
import { Injectable } from "@angular/core";

export type GetAllScheduleByFilterParams = {
  startsAt: Date;
  endsAt: Date;
};

@Injectable()
export class ScheduleService extends PllRestService<Schedule> {
  override baseRoute: string = environment.apiUrl;
  override pathRoute: string = "schedule";

  getAllByFilter({ startsAt, endsAt }: GetAllScheduleByFilterParams): Observable<PllPaginatedResponse<Schedule>> {
    return this.http.get<PllPaginatedResponse<Schedule>>(`${this.baseRoute}/${this.pathRoute}`, { params: {
      startsAt: moment(startsAt).format("YYYY-MM-DD"),
      endsAt: moment(endsAt).format("YYYY-MM-DD"),
    }});
  };
};