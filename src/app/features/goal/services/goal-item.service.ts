import { PllID, PllPaginatedResponse, PllRestService } from "@pollaris";
import { GoalItem } from "../models/goal-item.model";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Injectable } from "@angular/core";

export type GetAllGoalItemByFilterParams = {
  goalId: PllID;
};

export type GetAllGoalItemByFilterResponse = GoalItem;

@Injectable()
export class GoalItemService extends PllRestService<GoalItem> {
  override baseRoute: string = environment.apiUrl;
  override pathRoute: string = "goal-item";

  getAllByFilter({ goalId }: GetAllGoalItemByFilterParams): Observable<PllPaginatedResponse<GetAllGoalItemByFilterResponse>> {
    return this.http.get<PllPaginatedResponse<GetAllGoalItemByFilterResponse>>(`${this.baseRoute}/${this.pathRoute}/goal/${goalId}`);
  };
};