import { PllID, PllPaginatedResponse, PllRestService } from "@pollaris";
import { GoalTask } from "../models/goal-task.model";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Injectable } from "@angular/core";

export type GetAllGoalTaskByFilterParams = {
  goalId: PllID;
};

export type GetAllGoalTaskByFilterResponse = GoalTask;

@Injectable()
export class GoalTaskService extends PllRestService<GoalTask> {
  override baseRoute: string = environment.apiUrl;
  override pathRoute: string = "goal-task";

  getAllByFilter({ goalId }: GetAllGoalTaskByFilterParams): Observable<PllPaginatedResponse<GetAllGoalTaskByFilterResponse>> {
    return this.http.get<PllPaginatedResponse<GetAllGoalTaskByFilterResponse>>(`${this.baseRoute}/${this.pathRoute}/goal/${goalId}`);
  };
};