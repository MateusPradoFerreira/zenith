import { PllPaginatedResponse, PllRestService } from "@pollaris";
import { Goal } from "../models/goal.model";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Injectable } from "@angular/core";
import moment from "moment";

export type GetAllGoalByFilterParams = {
  status?: "PENDING" | "FINISHED" | "ALL";
  startsAt: Date;
};

export type GetAllGoalByFilterResponse = Goal & {
  status: string;
  score: number;
};

@Injectable()
export class GoalService extends PllRestService<Goal> {
  override baseRoute: string = environment.apiUrl;
  override pathRoute: string = "goal";

  getAllByFilter({ status, startsAt }: GetAllGoalByFilterParams): Observable<PllPaginatedResponse<GetAllGoalByFilterResponse>> {
    return this.http.get<PllPaginatedResponse<GetAllGoalByFilterResponse>>(`${this.baseRoute}/${this.pathRoute}`, { params: {
      status,
      startsAt: moment(startsAt).format("YYYY-MM-DD"),
    }});
  };
};